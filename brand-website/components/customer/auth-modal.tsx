"use client";

import { useState } from "react";
import { Phone, ArrowRight, RefreshCw, User, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/auth";
import toast from "react-hot-toast";

const MOCK_OTP = "1234";

export function AuthModal() {
  const { isModalOpen, step, phone, setPhone, setStep, setUser, closeModal } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);

  const handleSendOtp = async () => {
    if (phone.length < 10) { toast.error("Enter a valid phone number"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("otp");
    toast.success(`OTP sent to ${phone} (use 1234)`);
  };

  const handleVerifyOtp = async () => {
    const entered = otpDigits.join("");
    if (entered.length < 4) { toast.error("Enter the 4-digit OTP"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    if (entered !== MOCK_OTP) { toast.error("Invalid OTP"); return; }
    setStep("profile");
  };

  const handleComplete = async () => {
    if (name.trim().length < 2) { toast.error("Enter your name"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setUser({
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: "",
      phone,
      role: "CUSTOMER",
    });
    toast.success(`Welcome, ${name.trim()}! 🎉`);
    setLoading(false);
  };

  const handleOtpDigit = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits];
    next[idx] = val;
    setOtpDigits(next);
    if (val && idx < 3) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} size="sm">
      <div className="p-6">
        <AnimatePresence mode="wait">

          {/* ── Step 1: Phone ── */}
          {step === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="text-center">
                <div className="w-14 h-14 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Phone size={26} className="text-white" />
                </div>
                <h2 className="text-xl font-bold font-heading">Sign in to order</h2>
                <p className="text-sm text-gray-500 mt-1">We'll send you a quick OTP</p>
              </div>
              <Input
                label="Phone number"
                type="tel"
                placeholder="+92 300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone size={15} />}
              />
              <Button fullWidth size="lg" loading={loading} onClick={handleSendOtp}>
                Send OTP <ArrowRight size={16} />
              </Button>
              <p className="text-xs text-center text-gray-400">
                By continuing you agree to our Terms & Privacy Policy
              </p>
            </motion.div>
          )}

          {/* ── Step 2: OTP ── */}
          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="text-center">
                <div className="w-14 h-14 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📱</span>
                </div>
                <h2 className="text-xl font-bold font-heading">Enter OTP</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Sent to <span className="font-medium text-gray-800">{phone}</span>
                </p>
              </div>

              {/* OTP digit inputs */}
              <div className="flex gap-3 justify-center">
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="tel"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpDigit(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-14 h-14 text-center text-2xl font-bold rounded-2xl border-2 border-gray-200 focus:border-brand-500 focus:outline-none transition-colors"
                  />
                ))}
              </div>

              <Button fullWidth size="lg" loading={loading} onClick={handleVerifyOtp}>
                Verify OTP
              </Button>
              <button
                onClick={() => { setOtpDigits(["","","",""]); setStep("phone"); }}
                className="w-full text-sm text-brand-500 flex items-center justify-center gap-1"
              >
                <RefreshCw size={13} /> Change number
              </button>
            </motion.div>
          )}

          {/* ── Step 3: Profile ── */}
          {step === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={28} className="text-green-600" />
                </div>
                <h2 className="text-xl font-bold font-heading">Almost there!</h2>
                <p className="text-sm text-gray-500 mt-1">What should we call you?</p>
              </div>
              <Input
                label="Your name"
                placeholder="Ali Haider"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User size={15} />}
              />
              <Button fullWidth size="lg" loading={loading} onClick={handleComplete}>
                Let's eat! 🍔
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </Modal>
  );
}
