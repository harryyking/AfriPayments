import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Welcome to AI Background Removal Studio
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Remove backgrounds from your images with AI and add stunning text overlays. Sign in to get started!
      </p>
      <Link href="/auth">
        <button className="btn btn-primary">
          Sign In with Google
        </button>
      </Link>
    </div>
  );
}