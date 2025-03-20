import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Boost Your Remote Work Productivity</h1>
      <p className="text-lg mb-8">Plan your day and stay focused with our free tools</p>
      <div className="flex space-x-4">
        <Link href="/schedule" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
          Create Schedule
        </Link>
        <Link href="/pomodoro" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
          Start Pomodoro
        </Link>
      </div>
    </div>
  )
}