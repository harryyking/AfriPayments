import Link from "next/link";

export default function FlutterwaveDocs() {
  return (
    <div>
      <h1>Flutterwave Documentation</h1>
      <p>
        Flutterwave is a pan-African payment gateway supporting multiple
        currencies and payment methods. Use `flutterwave-react-v3` for React
        integration.
      </p>
      <ul>
        <li>
          <Link href="/flutterwave/integration">Integration Guide</Link>
        </li>
      </ul>
    </div>
  );
}