import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Fintech Payment Solutions for Africa</h1>
      <p>
        Learn how to integrate payment solutions like Paystack and Flutterwave
        into your products using React libraries to collect money online across
        Africa.
      </p>
      <ul>
        <li>
          <Link href="/paystack">Paystack</Link>
        </li>
        <li>
          <Link href="/flutterwave">Flutterwave</Link>
        </li>
      </ul>
    </div>
  );
}