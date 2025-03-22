import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Adjust this import based on where your auth config is
import { redirect } from "next/navigation";
import ClientDashboard from "./_component/dashboard";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // If no session exists, redirect to sign-in page
  if (!session || !session.user) {
    redirect("/auth");
  }

  // Since this is a client component, we'll still use useSession for client-side state
  return (
    <ClientDashboard />
  );
}