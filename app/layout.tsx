import '@/styles/globals.css'
import { Navbar } from '@/components/Navbar';
import {Bricolage_Grotesque} from 'next/font/google'

const brandFont = Bricolage_Grotesque({subsets: ['latin']})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={brandFont.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}