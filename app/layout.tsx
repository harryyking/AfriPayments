import '@/styles/globals.css'

import {Inter} from 'next/font/google'

const brandFont = Inter({subsets: ['latin']})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body className={brandFont.className}>
        <div className='p-2 min-h-screen flex justify-center items-center' data-theme="emerald">
        {children}
        </div>
      </body>
    </html>
  );
}