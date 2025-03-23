"use client";

import { useState, useCallback } from "react";
import { PaystackConsumer } from "react-paystack";
import axios from "axios";
import { toast } from "react-hot-toast";

interface PaystackButtonProps {
  userId: string;
  email: string;
  onPaymentSuccess: () => void;
}

export default function PaystackButton({ userId, email, onPaymentSuccess }: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  const config = {
    publicKey: PAYSTACK_PUBLIC_KEY,
    email,
    amount: 499, // $4.99 in cents (USD)
    currency: "USD",
    reference: `ref_${Math.floor(Math.random() * 1000000000) + 1}`,
    metadata: { userId },
  };

  const handleSuccess = useCallback(
    async (response: { reference: string }) => {
      setIsLoading(true);
      try {
        const res = await axios.post("/api/paystack/verify", {
          reference: response.reference,
          userId,
        });

        if (res.data.status === "success") {
          toast.success("Payment successful!");
          onPaymentSuccess();
        } else {
          toast.error("Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Error verifying payment");
      } finally {
        setIsLoading(false);
      }
    },
    [userId, onPaymentSuccess]
  );

  const handleClose = useCallback(() => {
    toast.error("Payment window closed");
  }, []);

  if (!PAYSTACK_PUBLIC_KEY) {
    return (
      <button className="btn btn-primary w-full" disabled>
        Payment Configuration Error
      </button>
    );
  }

  return (
    <PaystackConsumer {...config} onSuccess={handleSuccess} onClose={handleClose}>
      {({ initializePayment }) => (
        <button
          className="btn btn-primary w-full"
          onClick={() => initializePayment(handleSuccess, handleClose)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Pay and Download ($4.99)"}
        </button>
      )}
    </PaystackConsumer>
  );
}