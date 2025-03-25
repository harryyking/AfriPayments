import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Provider from '@/components/Provider';
import { fontOptions } from '@/lib/font';

const brandFont = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: 'TextVeil',
  description: 'A free tool to overlay text on images with customizable styles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body className={brandFont.className} data-theme="emerald">
        <Provider>
          <div>
            {children}

          </div>
        <Toaster position="top-right" />
        </Provider>
      </body>
    </html>
  );
}