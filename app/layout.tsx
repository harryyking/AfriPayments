import '@/styles/globals.css'
import { Navbar } from '@/components/Navbar';
import {Inter} from 'next/font/google'

const brandFont = Inter({subsets: ['latin']})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={brandFont.className}>
        <Navbar />
        <div className='p-2'>
        {children}
        </div>
      </body>
    </html>
  );
}