export interface Task {
    id: string;
    name: string;
    time: number;
    priority: 'high' | 'medium' | 'low';
  }
  
  export interface ScheduleItem {
    name: string;
    start: string;
    end: string;
  }
  
  export function generateSchedule(tasks: Task[], startTime: string): ScheduleItem[] {
    // Parse start time to minutes
    const [hours, minutes] = startTime.split(':').map(Number);
    let currentTimeInMinutes = hours * 60 + minutes;
    
    // Sort tasks by priority
    const sortedTasks = [...tasks].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Map tasks to time slots
    return sortedTasks.map(task => {
      const startMinutes = currentTimeInMinutes;
      const endMinutes = currentTimeInMinutes + task.time;
      
      // Format time as HH:MM AM/PM
      const startFormatted = formatTime(startMinutes);
      const endFormatted = formatTime(endMinutes);
      
      // Update current time for next task
      currentTimeInMinutes = endMinutes;
      
      return {
        name: task.name,
        start: startFormatted,
        end: endFormatted
      };
    });
  }
  
  function formatTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60) % 12 || 12; // Convert to 12-hour format
    const minutes = totalMinutes % 60;
    const period = totalMinutes < 720 || totalMinutes >= 1440 ? 'AM' : 'PM';
    
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }