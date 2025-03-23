// paystack.d.ts
declare module "react-paystack" {
  export interface PaystackProps {
    publicKey: string;
    email: string;
    amount: number;
    reference: string;
    currency?: string;
    metadata?: Record<string, any>;
    onSuccess: (response: { reference: string }) => void | Promise<void>; // Updated
    onClose: () => void;
  }

  export const PaystackConsumer: React.FC<
    PaystackProps & {
      children: (args: {
        initializePayment: (
          onSuccess: (response: { reference: string }) => void | Promise<void>,
          onClose: () => void
        ) => void;
      }) => React.ReactNode;
    }
  >;
}