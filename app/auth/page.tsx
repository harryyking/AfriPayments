"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const [googleIsLoading, setGoogleIsLoading] = useState(false)
  const router = useRouter();

  if (status === "loading") {
    return <div className="text-center p-4 min-h-screen">Loading...</div>;
  }

  if (session) {
    router.push("/dashboard");
    return null;
  }

  const handleSignInGoogle = async() => {
    setGoogleIsLoading(true);
    const signInResult = await signIn("google", {callbackUrl: '/dashboard'});
    if (!signInResult) {
      setGoogleIsLoading(false);
      return;
    }

    if(signInResult.ok) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-white shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <button
          className="btn btn-primary w-full"
          onClick={handleSignInGoogle}
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}