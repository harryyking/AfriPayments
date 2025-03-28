"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

const SignIn = () => {
  const [googleIsLoading, setGoogleIsLoading] = useState(false);

  const handleSignInGoogle = async () => {
    setGoogleIsLoading(true);
    try {
      // Initiate Google sign-in with callback URL
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true, // Let NextAuth handle the redirect
      });

      // If result is undefined or has an error, handle it
      if (!result || result.error) {
        console.error("Sign-in failed:", result?.error || "Unknown error");
        alert("Failed to sign in with Google. Please try again."); // Replace with toast if you have a notification system
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setGoogleIsLoading(false); // Always reset loading state
    }
  };

  return (
    <div className="min-h-screen w-full bg-base-200 flex flex-col items-center justify-center p-4">
      <div className="card shadow-sm p-2">
        <div className="card-title text-xl text-center">Sign In</div>

        <div className="card-body ">
          <button
            className="w-full btn btn-primary font-medium card-actions"
            onClick={handleSignInGoogle}
            disabled={googleIsLoading}
          >
            {googleIsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>
        <div className="text-center mt-4 text-sm text-gray-500">
        <p>
          By signing in, you agree to our{" "}
          <a href="/terms-of-service" className="text-primary underline">
            terms of service
          </a>
        </p>
      </div>
      </div>

      
    </div>
  );
};

export default SignIn;