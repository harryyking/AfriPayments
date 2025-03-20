'use client';

import { useState, useEffect } from 'react';
import TaskForm from '../../components/TaskForm';
import ScheduleDisplay from '../../components/ScheduleDisplay';
import AffiliateLinks from '../../components/AffiliateLinks';
import { Task } from '../../lib/schedule';
import { getTasksFromStorage, saveTasksToStorage } from '../../lib/storage';

export default function SchedulePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = getTasksFromStorage();
    setTasks(savedTasks);
  }, []);
  
  const handleAddTask = (task: Task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };
  
  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Schedule Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Tasks</h2>
          <TaskForm onAddTask={handleAddTask} />
          
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
            {tasks.length > 0 ? (
              <ul className="border rounded divide-y">
                {tasks.map(task => (
                  <li key={task.id} className="p-3 flex justify-between items-center">
                    <div>
                      <span className="font-medium">{task.name}</span>
                      <div className="text-sm text-gray-600">
                        <span>{task.time} minutes</span> • 
                        <span className={`ml-1 ${
                          task.priority === 'high' ? 'text-red-600' : 
                          task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete Task"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No tasks added yet.</p>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Generate Schedule</h2>
          <ScheduleDisplay tasks={tasks} />
          <AffiliateLinks />
        </div>
      </div>
    </div>
  );
}