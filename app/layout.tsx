import '@/styles/globals.css'

import {Lato} from 'next/font/google'

const brandFont = Lato({subsets: ['latin'], weight: ["100", "300", "700"]})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="bumblebee">
      <body className={brandFont.className}>
        <div className='p-2 min-h-screen flex justify-center items-center'>
        {children}
        </div>
      </body>
    </html>
  );
}