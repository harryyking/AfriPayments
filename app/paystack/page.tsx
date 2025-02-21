import Link from "next/link";

export default function PaystackDocs() {
  return (
    <div>
      <h1>Paystack Documentation</h1>
      <p>
        Paystack is a leading payment gateway in Africa, supporting businesses in
        Nigeria, Ghana, and South Africa. Use the `react-paystack` library for
        easy React integration.
      </p>
      <ul>
        <li>
          <Link href="/paystack/integration">Integration Guide</Link>
        </li>
      </ul>
    </div>
  );
}