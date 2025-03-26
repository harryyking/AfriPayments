"use client";

import { useState, useCallback } from "react";
import { PaystackConsumer, type PaystackProps } from "react-paystack";
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

  // Configuration for the initial transaction to tokenize the card
  const config = {
    publicKey: PAYSTACK_PUBLIC_KEY,
    email,
    amount: 100, // $1 in cents (USD) for card tokenization
    currency: "USD",
    reference: `ref_${Math.floor(Math.random() * 1000000000) + 1}`,
    metadata: { userId },
  };

  const handleSuccess = useCallback(
    async (response: { reference: string }) => {
      setIsLoading(true);
      try {
        // Step 1: Verify the initial transaction to get the authorization code
        const verifyRes = await axios.post("/api/paystack/verify", {
          reference: response.reference,
          userId,
        });

        if (verifyRes.data.status !== "success") {
          throw new Error("Initial transaction verification failed");
        }

        const authorizationCode = verifyRes.data.data.authorization.authorization_code;

        // Step 2: Create a subscription using the authorization code
        const subscriptionRes = await axios.post("/api/paystack/subscribe", {
          userId,
          email,
          authorizationCode,
          planCode: "PLN_abc123", // Replace with your actual plan code
        });

        if (subscriptionRes.data.status !== "success") {
          throw new Error("Failed to create subscription");
        }

        // Step 3: Update the user's subscription status in the database
        await axios.post("/api/paystack/update-subscription", {
          userId,
          subscriptionCode: subscriptionRes.data.data.subscription_code,
          subscriptionStatus: subscriptionRes.data.data.status,
        });

        toast.success("Subscription created successfully!");
        onPaymentSuccess();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Subscription error:", error);
        toast.error(`Error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, email, onPaymentSuccess]
  );

  const handleClose = useCallback(() => {
    toast.error("Payment window closed");
  }, []);

  if (!PAYSTACK_PUBLIC_KEY) {
    return (
      <button className="btn btn-warning w-full" disabled>
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
          {isLoading ? "Processing..." : "Subscribe for $5/month"}
        </button>
      )}
    </PaystackConsumer>
  );
}