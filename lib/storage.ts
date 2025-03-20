import { Task } from './schedule';

export function getTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const tasksString = localStorage.getItem('tasks');
    return tasksString ? JSON.parse(tasksString) : [];
  } catch (error) {
    console.error('Error retrieving tasks from storage:', error);
    return [];
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
}

export function getTimerFromStorage(): { timeLeft: number, isWork: boolean } {
  if (typeof window === 'undefined') return { timeLeft: 25 * 60, isWork: true };
  
  try {
    const timerString = localStorage.getItem('timer');
    return timerString 
      ? JSON.parse(timerString) 
      : { timeLeft: 25 * 60, isWork: true };
  } catch (error) {
    console.error('Error retrieving timer from storage:', error);
    return { timeLeft: 25 * 60, isWork: true };
  }
}

export function saveTimerToStorage(timeLeft: number, isWork: boolean): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('timer', JSON.stringify({ timeLeft, isWork }));
  } catch (error) {
    console.error('Error saving timer to storage:', error);
  }
}