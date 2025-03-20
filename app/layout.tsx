import type { Metadata } from 'next'
import '@/styles/globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Remote Work Productivity Planner',
  description: 'Plan your day and boost productivity with our free remote work tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen flex flex-col">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="font-bold text-xl">Remote Work Planner</div>
            <div className="space-x-4">
              <Link href="/" className="hover:text-blue-300">Home</Link>
              <Link href="/schedule" className="hover:text-blue-300">Schedule</Link>
              <Link href="/pomodoro" className="hover:text-blue-300">Pomodoro</Link>
            </div>
          </div>
        </nav>
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
          <p>Some links are affiliate links, which may earn us a commission at no extra cost to you.</p>
        </footer>
      </body>
    </html>
  )
}