'use client';

import { useState } from 'react';
import { Task } from '../lib/schedule';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName || !taskTime) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      time: parseInt(taskTime),
      priority: taskPriority
    };
    
    onAddTask(newTask);
    
    // Reset form
    setTaskName('');
    setTaskTime('');
    setTaskPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label htmlFor="taskName" className="block mb-2">Task Name</label>
        <input
          id="taskName"
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="taskTime" className="block mb-2">Time (minutes)</label>
        <input
          id="taskTime"
          type="number"
          placeholder="Time (minutes)"
          min="5"
          value={taskTime}
          onChange={(e) => setTaskTime(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="taskPriority" className="block mb-2">Priority</label>
        <select
          id="taskPriority"
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
          className="border p-2 w-full rounded"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      
      <button 
        type="submit" 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        aria-label="Add Task"
      >
        Add Task
      </button>
    </form>
  );
}