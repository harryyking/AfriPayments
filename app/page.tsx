import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        TextVeil
      </h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
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