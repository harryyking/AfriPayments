import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';
import Head from 'next/head'

export const metadata: Metadata = {
  title: 'Text Overlay Tool',
  description: 'A free tool to overlay text on images with customizable styles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
      <script src="https://docs.opencv.org/4.5.5/opencv.js" async></script>
      </Head>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}