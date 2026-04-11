import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthPage = () => {
  const { login, signupSendOtp, signupVerifyOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isLogin, setIsLogin] = useState(true); 
  const [role, setRole] = useState("user"); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Enter email and password");
    try {
      setLoading(true);
      await login(email, password);
      
      const redirectRole = searchParams.get("role") || role;
      if (redirectRole === 'parking') {
         navigate('/manage-parking');
      } else {
         navigate('/find-parking');
      }
    } catch (err) {
      console.error(err);
      
    } finally {
      setLoading(false);
    }
  };

  const handleSignupInit = async () => {
    if (!name || !email || !password || !phoneNumber) {
        return toast.error("All fields (Name, Email, Password, Phone) are required for signup");
    }
    
    try {
        setLoading(true);
        await signupSendOtp(name, email, password, phoneNumber);
        setIsOtpSent(true);
        toast.info(`OTP sent to ${email}`);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleSignupVerify = async () => {
    if (!otp) return toast.error("Please enter the OTP");
    try {
        setLoading(true);
        
         await signupVerifyOtp(name, email, password, phoneNumber, otp, role);
         
         const redirectRole = searchParams.get("role") || role;
         if (redirectRole === 'parking') {
            navigate('/manage-parking');
         } else {
            navigate('/find-parking');
         }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-20 pb-10">
      <Card className="p-8 w-full max-w-md shadow-xl border-0">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[color:var(--color-Secondary)]">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {}
        <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-lg">
             <button 
                onClick={() => { setIsLogin(true); setIsOtpSent(false); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${isLogin ? 'bg-white shadow-sm text-Primary' : 'text-gray-500 hover:text-gray-700'}`}
             >
                Login
             </button>
             <button 
                onClick={() => { setIsLogin(false); setIsOtpSent(false); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!isLogin ? 'bg-white shadow-sm text-Primary' : 'text-gray-500 hover:text-gray-700'}`}
             >
                Sign Up
             </button>
        </div>

        {}
         {}

        <div className="space-y-4">
            {}
            {isLogin && (
                <>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input 
                            type="email" 
                            placeholder="hello@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <Button 
                        className="w-full bg-Primary hover:bg-orange-600 text-white mt-4"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </>
            )}

            {}
            {!isLogin && !isOtpSent && (
                <>
                     <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input 
                            placeholder="John Doe" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input 
                            placeholder="+91 9876543210" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input 
                            type="email" 
                            placeholder="hello@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <Button 
                        className="w-full bg-Primary hover:bg-orange-600 text-white mt-4"
                        onClick={handleSignupInit}
                        disabled={loading}
                    >
                        {loading ? "Sending OTP..." : "Get OTP"}
                    </Button>
                </>
            )}

            {}
            {!isLogin && isOtpSent && (
                <div className="py-4 space-y-4 animate-in fade-in zoom-in-95">
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Enter the OTP sent to</p>
                        <p className="font-medium text-gray-800">{email}</p>
                    </div>
                    <div className="space-y-2">
                         <Label>OTP</Label>
                         <Input 
                             className="text-center tracking-widest text-lg" 
                             placeholder="123456" 
                             maxLength={6}
                             value={otp} 
                             onChange={(e) => setOtp(e.target.value)} 
                         />
                    </div>
                    <Button 
                        className="w-full bg-brand hover:bg-green-600 text-white mt-4"
                        onClick={handleSignupVerify}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify & Sign Up"}
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-xs text-gray-500"
                        onClick={() => setIsOtpSent(false)}
                    >
                        Back to details
                    </Button>
                </div>
            )}

        </div>
      </Card>
    </div>
  );
}

export default AuthPage;
