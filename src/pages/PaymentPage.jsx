import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, ShieldCheck, XCircle } from "lucide-react";
import { paymentService } from "../services/payment.service";
import { bookingService } from "../services/booking.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const readNumber = (...values) => {
  for (const value of values) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return 0;
};

const readString = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

function loadRazorpaySdk() {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function normalizeOrderPayload(rawOrder, bookingId, fallbackAmount) {
  const orderId = readString(
    rawOrder?.id,
    rawOrder?.orderId,
    rawOrder?.order_id,
    rawOrder?.razorpay_order_id
  );

  return {
    orderId,
    amount: readNumber(rawOrder?.amount, rawOrder?.total_amount, fallbackAmount),
    amountRs: readNumber(rawOrder?.amountRs, rawOrder?.amount_rs),
    currency: readString(rawOrder?.currency, "INR"),
    keyId: readString(
      rawOrder?.key,
      rawOrder?.keyId,
      rawOrder?.key_id,
      rawOrder?.razorpay_key,
      import.meta.env.VITE_RAZORPAY_KEY_ID
    ),
    bookingId: Number(rawOrder?.booking_id ?? rawOrder?.bookingId ?? bookingId),
    notes: rawOrder?.notes || {},
    raw: rawOrder,
  };
}

export default function PaymentPage() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [confirmedAmountRs, setConfirmedAmountRs] = useState(null);
  // Pre-fetched order stored so razorpay.open() can be called synchronously on click
  const [preparedOrder, setPreparedOrder] = useState(null);
  const [preparing, setPreparing] = useState(false);
  const failureReportedRef = useRef(false);
  const paymentFailedRef = useRef(false);

  const amountFromQuery = useMemo(() => {
    return readNumber(searchParams.get("amount"));
  }, [searchParams]);

  

  const verifyPaymentMutation = useMutation({
    mutationFn: paymentService.verifyPayment,
  });

  const failPaymentMutation = useMutation({
    mutationFn: paymentService.failPayment,
  });

  const checkoutMutation = useMutation({
    mutationFn: bookingService.checkoutBooking,
  });

  const reportFailedPayment = async () => {
    if (!bookingId || failureReportedRef.current) {
      return;
    }

    failureReportedRef.current = true;

    try {
      await failPaymentMutation.mutateAsync(Number(bookingId));
    } catch (error) {
      failureReportedRef.current = false;
      console.error("Failed to report payment failure", error);
    }
  };

  // Pre-load the SDK and pre-fetch the Razorpay order as soon as the page mounts,
  // so the button click can open the modal immediately (avoids popup blocking).
  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;

    (async () => {
      setPreparing(true);
      try {
        await loadRazorpaySdk();
        const rawOrder = await paymentService.createOrder(bookingId);
        if (cancelled) return;

        const order = normalizeOrderPayload(rawOrder, bookingId, amountFromQuery);
        const realAmountRs = order.amountRs
          ? Math.round(order.amountRs)
          : order.amount > 1000
            ? Math.round(order.amount / 100)
            : order.amount;

        setConfirmedAmountRs(realAmountRs);
        setPreparedOrder(order);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to prepare order:", err);
          toast.error(err?.message || "Could not prepare payment. Please try again.");
        }
      } finally {
        if (!cancelled) setPreparing(false);
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const openRealCheckout = () => {
    if (!bookingId) {
      toast.error("Booking id is missing.");
      return;
    }
    if (!preparedOrder) {
      toast.error("Payment is still loading. Please wait a moment.");
      return;
    }
    const order = preparedOrder;

    if (!order.orderId) {
      toast.error("Order id not returned by payments API.");
      return;
    }

    if (!order.keyId) {
      toast.error("Razorpay key id is missing.");
      return;
    }

    setLoading(true);
    paymentFailedRef.current = false;
    failureReportedRef.current = false;

    // Called synchronously — no await before open() so browser won't block it
    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "Sahi Spot",
      description: `Parking payment for booking #${bookingId}`,
      order_id: order.orderId,
      handler: async (response) => {
        try {
          await verifyPaymentMutation.mutateAsync({
            booking_id: order.bookingId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (searchParams.get("checkout") === "true") {
            try {
              await checkoutMutation.mutateAsync(order.bookingId);
              toast.success("Payment successful! Car successfully checked out.");
            } catch (err) {
              console.error("Auto checkout failed", err);
              toast.error("Payment successful, but you may need to click checkout manually in the dashboard.");
            }
          } else {
            toast.success("Payment received successfully.");
          }

          setStatus("success");
        } catch (verifyError) {
          console.error("Payment verification failed", verifyError);
          setStatus("failed");
          toast.error("Payment was captured but verification failed.");
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: async () => {
          if (paymentFailedRef.current) {
            await reportFailedPayment();
          }
          setLoading(false);
          toast.message("Payment window closed.");
        },
      },
      prefill: {
        name: readString(order.raw?.customer_name, order.raw?.name),
        email: readString(order.raw?.customer_email, order.raw?.email),
        contact: readString(order.raw?.customer_phone, order.raw?.phone),
      },
      notes: {
        booking_id: String(order.bookingId),
        ...order.notes,
      },
      theme: {
        color: "#3399cc",
      },
    });

    razorpay.on("payment.failed", async (response) => {
      console.error("Razorpay payment failed", response?.error);
      paymentFailedRef.current = true;
      await reportFailedPayment();
      setStatus("failed");
      setLoading(false);
      toast.error(response?.error?.description || "Payment failed. Please try again.");
    });

    razorpay.open();
  };

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] p-4">
        <Card className="w-full max-w-md border border-emerald-400/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.9))] px-4 py-8 text-center text-white shadow-xl">
          <CheckCircle2 size={64} className="mx-auto mb-4 text-green-400" />
          <CardTitle className="mb-2 text-2xl text-white">Booking Confirmed!</CardTitle>
          <CardDescription className="mb-6 text-slate-400">
            Your payment of Rs. {confirmedAmountRs ?? amountFromQuery ?? 0} was successful.
          </CardDescription>
          <Button onClick={() => navigate("/dashboard")} className="w-full bg-green-600 hover:bg-green-700">
            View My Bookings
          </Button>
        </Card>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] p-4">
        <Card className="w-full max-w-md border border-red-400/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.9))] px-4 py-8 text-center text-white shadow-xl">
          <XCircle size={64} className="mx-auto mb-4 text-red-500" />
          <CardTitle className="mb-2 text-2xl text-white">Payment Failed</CardTitle>
          <CardDescription className="mb-6 text-slate-400">
            Something went wrong while processing your transaction.
          </CardDescription>
          <Button
            onClick={() => {
              setStatus("pending");
              setLoading(false);
            }}
            variant="outline"
            className="mb-3 w-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
          >
            Try Again
          </Button>
          <Button onClick={() => navigate(-1)} variant="ghost" className="w-full text-slate-400 hover:text-white">
            Cancel Booking
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] px-4 pt-24">
      <Card className="w-full max-w-lg border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.9))] text-white shadow-2xl">
        <CardHeader className="rounded-t-xl border-b border-white/10 py-8 text-center">
          <ShieldCheck size={48} className="mx-auto mb-4 text-green-400" />
          <CardTitle className="text-2xl font-bold">Secure Checkout</CardTitle>
          <CardDescription className="mt-2 text-slate-400">Complete your booking payment</CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-medium text-slate-400">Total Amount Due:</span>
            <span className="text-3xl font-bold text-white">Rs. {confirmedAmountRs ?? amountFromQuery ?? 0}</span>
          </div>

          <div className="space-y-4">
            <Button
              onClick={openRealCheckout}
              disabled={loading || preparing}
              className="flex w-full items-center gap-2 bg-[#3399cc] py-6 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-[#2b82ad]"
            >
              <CreditCard size={20} />
              {preparing ? "Preparing payment..." : loading ? "Opening Razorpay..." : "Pay with Razorpay"}
            </Button>
            <Button onClick={() => navigate(-1)} variant="ghost" disabled={loading || preparing} className="w-full text-slate-400 hover:text-white">
              Cancel
            </Button>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1 text-center text-xs text-slate-500">
            Powered by Razorpay Secure
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
