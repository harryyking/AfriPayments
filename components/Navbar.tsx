import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Fintech Docs</Link>
      <ul>
        <li>
          <Link href="/paystack">Paystack</Link>
        </li>
        <li>
          <Link href="/flutterwave">Flutterwave</Link>
        </li>
      </ul>
    </nav>
  );
}