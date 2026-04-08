import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { paymentService } from '../services/payment.service';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get('amount') || 0;
  
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); // pending | success | failed
  const [loading, setLoading] = useState(false);

  // Define mutations
  const createOrderMutation = useMutation({
      mutationFn: () => paymentService.createOrder(bookingId),
  });

  const verifyPaymentMutation = useMutation({
      mutationFn: paymentService.verifyPayment,
  });

  const initiateMockPayment = async () => {
      try {
          setLoading(true);
          // 1. Create order
          const order = await createOrderMutation.mutateAsync();
          
          // 2. Mock Razorpay Window Delay
          toast.info("Opening secure payment gateway...");
          await new Promise(res => setTimeout(res, 2000));
          
          // 3. Mock Verification Data
          const mockVerificationData = {
              booking_id: Number(bookingId),
              razorpay_order_id: order?.orderId || `order_${Math.random().toString(36).substr(2, 9)}`,
              razorpay_payment_id: `pay_${Math.random().toString(36).substr(2, 9)}`,
              razorpay_signature: "mock_signature_hash"
          };

          // 4. Verify Payment
          await verifyPaymentMutation.mutateAsync(mockVerificationData);
          
          setStatus('success');
          toast.success("Payment Received Successfully!");

      } catch (err) {
          console.error(err);
          setStatus('failed');
          toast.error("Payment failed. Please try again.");
      } finally {
          setLoading(false);
      }
  };

  if (status === 'success') {
      return (
          <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] flex items-center justify-center p-4">
              <Card className="max-w-md w-full text-center py-8 px-4 shadow-xl border border-emerald-400/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.9))] text-white">
                  <CheckCircle2 size={64} className="text-green-400 mx-auto mb-4" />
                  <CardTitle className="text-2xl mb-2 text-white">Booking Confirmed!</CardTitle>
                  <CardDescription className="mb-6 text-slate-400">Your payment of ₹{amount} was successful.</CardDescription>
                  <Button onClick={() => navigate('/dashboard')} className="w-full bg-green-600 hover:bg-green-700">View My Bookings</Button>
              </Card>
          </div>
      );
  }

  if (status === 'failed') {
      return (
          <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] flex items-center justify-center p-4">
              <Card className="max-w-md w-full text-center py-8 px-4 shadow-xl border border-red-400/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.9))] text-white">
                  <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                  <CardTitle className="text-2xl mb-2 text-white">Payment Failed</CardTitle>
                  <CardDescription className="mb-6 text-slate-400">Something went wrong with your transaction.</CardDescription>
                  <Button onClick={() => setStatus('pending')} variant="outline" className="w-full mb-3 border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">Try Again</Button>
                  <Button onClick={() => navigate(-1)} variant="ghost" className="w-full text-slate-400 hover:text-white">Cancel Booking</Button>
              </Card>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] flex flex-col items-center pt-24 px-4">
       <Card className="max-w-lg w-full shadow-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.9))] text-white">
           <CardHeader className="text-center border-b border-white/10 rounded-t-xl py-8">
               <ShieldCheck size={48} className="mx-auto mb-4 text-green-400" />
               <CardTitle className="text-2xl font-bold">Secure Checkout</CardTitle>
               <CardDescription className="text-slate-400 mt-2">Complete your booking payment</CardDescription>
           </CardHeader>
           
           <CardContent className="p-8">
               <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                   <span className="text-slate-400 font-medium">Total Amount Due:</span>
                   <span className="text-3xl font-bold text-white">₹{amount}</span>
               </div>
               
               <div className="space-y-4">
                   <Button 
                       onClick={initiateMockPayment} 
                       disabled={loading}
                       className="w-full bg-[#3399cc] hover:bg-[#2b82ad] text-white py-6 text-lg font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30"
                   >
                       <CreditCard size={20} />
                       {loading ? "Processing Securely..." : "Pay with Razorpay (Mock)"}
                   </Button>
                   <Button 
                       onClick={() => navigate(-1)} 
                       variant="ghost"
                       disabled={loading}
                       className="w-full text-slate-400 hover:text-white"
                   >
                       Cancel
                   </Button>
               </div>
               
               <p className="text-center text-xs text-slate-500 mt-6 flex justify-center items-center gap-1">
                   Powered by Razorpay Secure
               </p>
           </CardContent>
       </Card>
    </div>
  );
}
