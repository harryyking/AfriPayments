import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (session) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="card bg-white shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <button
          className="btn btn-primary w-full"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}