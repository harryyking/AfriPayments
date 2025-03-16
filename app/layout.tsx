import '@/styles/globals.css'

import {Inter} from 'next/font/google'

const brandFont = Inter({subsets: ['latin']})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="silk">
      <body className={brandFont.className}>
        <div className='p-2'>
        {children}
        </div>
      </body>
    </html>
  );
}