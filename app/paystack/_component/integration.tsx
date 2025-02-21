import CodeBlock from "@/components/CodeBlock";

export default function PaystackIntegration() {
  const reactPaystackCode = `
    import { PaystackButton } from 'react-paystack';

    export default function PaymentComponent() {
      const config = {
        reference: new Date().getTime().toString(),
        email: 'customer@example.com',
        amount: 500000, // Amount in kobo (5000 NGN)
        publicKey: 'pk_test_your_public_key',
      };

      const handleSuccess = (reference) => {
        console.log('Payment successful:', reference);
        // Call your backend to verify the payment
      };

      const handleClose = () => {
        console.log('Payment closed');
      };

      return (
        <PaystackButton
          text="Pay Now"
          className="payButton"
          {...config}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      );
    }
  `;

  const verifyPaymentCode = `
    // Example backend verification (Node.js with fetch)
    const verifyPayment = async (reference) => {
      const response = await fetch(\`https://api.paystack.co/transaction/verify/\${reference}\`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer sk_test_your_secret_key',
        },
      });
      const data = await response.json();
      return data;
    };
  `;

  return (
    <div>
      <h1>Paystack Integration Guide (react-paystack)</h1>
      <p>Follow these steps to integrate Paystack using `react-paystack`.</p>

      <h2>Step 1: Sign Up</h2>
      <p>
        Create a Paystack account at{" "}
        <a href="https://paystack.com">paystack.com</a> and get your API keys.
      </p>

      <h2>Step 2: Install the Library</h2>
      <CodeBlock code="npm install react-paystack" language="bash" />

      <h2>Step 3: Use PaystackButton</h2>
      <p>Add this code to your React component:</p>
      <CodeBlock code={reactPaystackCode} language="javascript" />

      <h2>Step 4: Verify Payment</h2>
      <p>Use a server-side API call to verify the transaction:</p>
      <CodeBlock code={verifyPaymentCode} language="javascript" />
    </div>
  );
}