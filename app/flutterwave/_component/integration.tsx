import CodeBlock from "@/components/CodeBlock";

export default function FlutterwaveIntegration() {
  const reactFlutterwaveCode = `
    import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

    export default function PaymentComponent() {
      const config = {
        public_key: 'FLWPUBK_TEST-your-public-key-X',
        tx_ref: Date.now().toString(),
        amount: 5000,
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: 'customer@example.com',
          phone_number: '07012345678',
          name: 'John Doe',
        },
        customizations: {
          title: 'My Store',
          description: 'Payment for items',
          logo: 'https://example.com/logo.png',
        },
      };

      const handleFlutterPayment = useFlutterwave(config);

      return (
        <button
          onClick={() => {
            handleFlutterPayment({
              callback: (response) => {
                console.log('Payment response:', response);
                closePaymentModal(); // Close modal after payment
              },
              onClose: () => {
                console.log('Payment cancelled');
              },
            });
          }}
        >
          Pay with Flutterwave
        </button>
      );
    }
  `;

  const verifyPaymentCode = `
    // Verify payment server-side (Node.js with fetch)
    const verifyPayment = async (txRef) => {
      const response = await fetch('https://api.flutterwave.com/v3/transactions/verify_by_reference', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer FLWSECK_TEST-your-secret-key-X',
        },
        query: { tx_ref: txRef },
      });
      const data = await response.json();
      return data;
    };
  `;

  return (
    <div>
      <h1>Flutterwave Integration Guide (flutterwave-react-v3)</h1>
      <p>Steps to integrate Flutterwave using `flutterwave-react-v3`.</p>

      <h2>Step 1: Sign Up</h2>
      <p>
        Get your API keys from{" "}
        <a href="https://flutterwave.com">flutterwave.com</a>.
      </p>

      <h2>Step 2: Install the Library</h2>
      <CodeBlock code="npm install flutterwave-react-v3" language="bash" />

      <h2>Step 3: Use the Hook</h2>
      <p>Initiate payments with this code:</p>
      <CodeBlock code={reactFlutterwaveCode} language="javascript" />

      <h2>Step 4: Verify Payment</h2>
      <p>Verify the transaction server-side:</p>
      <CodeBlock code={verifyPaymentCode} language="javascript" />
    </div>
  );
}