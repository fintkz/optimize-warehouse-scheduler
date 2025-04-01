
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import WorkerDetails from './WorkerDetails';

// Mock types matching the API schema
type TaskType = 'Unloading' | 'Loading' | 'Picking' | 'Putaway' | 'Idle';

interface Task {
  task_id: string;
  task_type: TaskType;
  start_time: string;
  end_time: string;
  assigned_workers: string[];
  assigned_dock?: number;
}

interface Worker {
  id: string;
  name: string;
  tasks: Task[];
}

// Mock data
const mockWorkers: Worker[] = [
  {
    id: 'DVIRGA',
    name: 'Dan Virga',
    tasks: [
      {
        task_id: 'T1',
        task_type: 'Unloading',
        start_time: '2024-08-26T08:15:00',
        end_time: '2024-08-26T08:45:00',
        assigned_workers: ['DVIRGA', 'MPIYA'],
        assigned_dock: 2
      },
      {
        task_id: 'T3',
        task_type: 'Picking',
        start_time: '2024-08-26T09:00:00',
        end_time: '2024-08-26T10:00:00',
        assigned_workers: ['DVIRGA', 'GFLAMMIA', 'MPIYA', 'WORKER4']
      }
    ]
  },
  {
    id: 'GFLAMMIA',
    name: 'Giorgina Flammia',
    tasks: [
      {
        task_id: 'T2',
        task_type: 'Putaway',
        start_time: '2024-08-26T08:15:00',
        end_time: '2024-08-26T08:45:00',
        assigned_workers: ['GFLAMMIA', 'WORKER4']
      },
      {
        task_id: 'T3',
        task_type: 'Picking',
        start_time: '2024-08-26T09:00:00',
        end_time: '2024-08-26T10:00:00',
        assigned_workers: ['DVIRGA', 'GFLAMMIA', 'MPIYA', 'WORKER4']
      },
      {
        task_id: 'T4',
        task_type: 'Loading',
        start_time: '2024-08-26T10:15:00',
        end_time: '2024-08-26T11:15:00',
        assigned_workers: ['GFLAMMIA', 'WORKER4'],
        assigned_dock: 3
      }
    ]
  },
  {
    id: 'MPIYA',
    name: 'Michael Piya',
    tasks: [
      {
        task_id: 'T1',
        task_type: 'Unloading',
        start_time: '2024-08-26T08:15:00',
        end_time: '2024-08-26T08:45:00',
        assigned_workers: ['DVIRGA', 'MPIYA'],
        assigned_dock: 2
      },
      {
        task_id: 'T3',
        task_type: 'Picking',
        start_time: '2024-08-26T09:00:00',
        end_time: '2024-08-26T10:00:00',
        assigned_workers: ['DVIRGA', 'GFLAMMIA', 'MPIYA', 'WORKER4']
      },
      {
        task_id: 'T5',
        task_type: 'Idle',
        start_time: '2024-08-26T10:15:00',
        end_time: '2024-08-26T11:15:00',
        assigned_workers: ['MPIYA']
      }
    ]
  }
];

// Helper function to get task color
const getTaskColor = (taskType: TaskType) => {
  switch (taskType) {
    case 'Unloading': return 'bg-blue-500';
    case 'Loading': return 'bg-indigo-500';
    case 'Picking': return 'bg-green-500';
    case 'Putaway': return 'bg-amber-500';
    case 'Idle': return 'bg-gray-300';
    default: return 'bg-gray-500';
  }
};

const ScheduleView = () => {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  // Time slots for the timeline
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = 8 + i;
    return `${hour}:00`;
  });

  // Convert time to position on the timeline
  const timeToPosition = (timeString: string) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    const startTime = 8 * 60; // 8:00 AM in minutes
    const totalWidth = 100;
    
    return ((timeInMinutes - startTime) / (8 * 60)) * totalWidth; // 8 hours timeline
  };

  // Calculate task width based on duration
  const calculateTaskWidth = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    const totalMinutes = 8 * 60; // 8 hours timeline
    
    return (durationMinutes / totalMinutes) * 100;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Worker Schedule Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Timeline header */}
            <div className="flex mb-4 ml-36 pr-4">
              {timeSlots.map((time, index) => (
                <div 
                  key={index} 
                  className="flex-1 text-center text-sm text-warehouse-gray font-medium"
                >
                  {time}
                </div>
              ))}
            </div>
            
            {/* Worker timelines */}
            <div className="space-y-6">
              {mockWorkers.map((worker) => (
                <div key={worker.id} className="relative">
                  {/* Worker name */}
                  <div className="flex items-center mb-2">
                    <Button 
                      variant="ghost" 
                      className="flex items-center space-x-2 w-36 justify-start p-2 hover:bg-warehouse-blue/10"
                      onClick={() => setSelectedWorker(worker)}
                    >
                      <User className="h-4 w-4 text-warehouse-blue" />
                      <span className="font-medium">{worker.name}</span>
                    </Button>
                    
                    {/* Timeline background */}
                    <div className="flex-1 h-12 bg-gray-50 rounded-md border border-gray-200 relative">
                      {/* Task blocks */}
                      {worker.tasks.map((task) => (
                        <div 
                          key={task.task_id}
                          className={`absolute h-10 my-1 ${getTaskColor(task.task_type)} rounded-md text-white px-2 py-1 text-xs overflow-hidden`}
                          style={{ 
                            left: `${timeToPosition(task.start_time)}%`, 
                            width: `${calculateTaskWidth(task.start_time, task.end_time)}%`,
                            minWidth: '40px'
                          }}
                        >
                          <div className="truncate font-medium">{task.task_type}</div>
                          {task.assigned_dock && (
                            <div className="truncate">Dock {task.assigned_dock}</div>
                          )}
                        </div>
                      ))}
                      
                      {/* Time markers */}
                      {timeSlots.map((_, index) => (
                        <div 
                          key={index} 
                          className="absolute h-full border-l border-gray-200"
                          style={{ left: `${(index / (timeSlots.length - 1)) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
                <span className="text-sm">Unloading</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-indigo-500 rounded-sm mr-2"></div>
                <span className="text-sm">Loading</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
                <span className="text-sm">Picking</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-amber-500 rounded-sm mr-2"></div>
                <span className="text-sm">Putaway</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded-sm mr-2"></div>
                <span className="text-sm">Idle</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Worker details panel */}
      <div className="lg:col-span-1">
        {selectedWorker ? (
          <WorkerDetails worker={selectedWorker} onClose={() => setSelectedWorker(null)} />
        ) : (
          <Card className="h-full flex items-center justify-center bg-gray-50 border-dashed border-2 p-8">
            <div className="text-center text-warehouse-gray">
              <User className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-medium mb-2">Worker Details</h3>
              <p className="text-sm">Select a worker from the timeline to view their detailed schedule.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScheduleView;
