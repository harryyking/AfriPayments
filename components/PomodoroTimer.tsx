'use client';

import { useState, useEffect } from 'react';
import { getTimerFromStorage, saveTimerToStorage } from '../lib/storage';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  
  // Load timer state from localStorage on mount
  useEffect(() => {
    const savedTimer = getTimerFromStorage();
    setTimeLeft(savedTimer.timeLeft);
    setIsWork(savedTimer.isWork);
  }, []);
  
  // Save timer state to localStorage on change
  useEffect(() => {
    saveTimerToStorage(timeLeft, isWork);
  }, [timeLeft, isWork]);
  
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      alert('Time\'s up!');
      
      // Switch between work and break
      if (isWork) {
        setIsWork(false);
        setTimeLeft(5 * 60); // 5 min break
      } else {
        setIsWork(true);
        setTimeLeft(25 * 60); // 25 min work
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWork]);
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWork ? 25 * 60 : 5 * 60);
  };
  
  const switchMode = () => {
    setIsRunning(false);
    setIsWork(!isWork);
    setTimeLeft(!isWork ? 25 * 60 : 5 * 60);
  };
  
  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">
          {isWork ? 'Work Session' : 'Break Session'}
        </h2>
        <div className="text-4xl font-mono mb-4">{formatTime()}</div>
      </div>
      
      <div className="space-x-2">
        <button
          onClick={toggleTimer}
          className={`p-2 rounded ${isRunning ? 'bg-red-500' : 'bg-green-500'} text-white`}
          aria-label={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetTimer}
          className="bg-blue-500 text-white p-2 rounded"
          aria-label="Reset Timer"
        >
          Reset
        </button>
        
        <button
          onClick={switchMode}
          className="bg-purple-500 text-white p-2 rounded"
          aria-label={isWork ? 'Switch to Break' : 'Switch to Work'}
        >
          {isWork ? 'Switch to Break' : 'Switch to Work'}
        </button>
      </div>
    </div>
  );
}