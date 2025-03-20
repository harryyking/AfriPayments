'use client';

import PomodoroTimer from '../../components/PomodoroTimer';
import AffiliateLinks from '../../components/AffiliateLinks';

export default function PomodoroPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Pomodoro Timer</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Focus Timer</h2>
          <PomodoroTimer />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Use the Pomodoro Technique</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Choose a task to work on</li>
            <li>Start the timer and work for 25 minutes</li>
            <li>When the timer ends, take a 5-minute break</li>
            <li>After 4 work sessions, take a longer 15-30 minute break</li>
          </ol>
        </div>
        
        <AffiliateLinks />
      </div>
    </div>
  );
}