'use client';

import { Task, generateSchedule, ScheduleItem } from '../lib/schedule';
import { useState } from 'react';

interface ScheduleDisplayProps {
  tasks: Task[];
}

export default function ScheduleDisplay({ tasks }: ScheduleDisplayProps) {
  const [startTime, setStartTime] = useState('09:00');
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerateSchedule = () => {
    const newSchedule = generateSchedule(tasks, startTime);
    setSchedule(newSchedule);
    setIsGenerated(true);
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="startTime" className="block mb-2">Start Time</label>
        <input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      
      <button
        onClick={handleGenerateSchedule}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors mb-4"
        aria-label="Generate Schedule"
        disabled={tasks.length === 0}
      >
        Generate Schedule
      </button>
      
      {isGenerated && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Your Schedule</h3>
          {schedule.length > 0 ? (
            <ul className="list-disc pl-5">
              {schedule.map((item, index) => (
                <li key={index} className="mb-1">
                  <span className="font-medium">{item.name}:</span> {item.start} - {item.end}
                </li>
              ))}
            </ul>
          ) : (
            <p>Add tasks to generate a schedule.</p>
          )}
        </div>
      )}
    </div>
  );
}