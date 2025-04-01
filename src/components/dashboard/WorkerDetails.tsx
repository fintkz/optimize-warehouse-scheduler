
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Calendar, Clock, Users, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Task {
  task_id: string;
  task_type: string;
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

interface WorkerDetailsProps {
  worker: Worker;
  onClose: () => void;
}

// Utility function to format time from ISO string
const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const WorkerDetails: React.FC<WorkerDetailsProps> = ({ worker, onClose }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Worker Details</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-14 w-14 rounded-full bg-warehouse-blue text-white flex items-center justify-center text-xl font-semibold">
            {worker.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{worker.name}</h3>
            <p className="text-warehouse-gray">ID: {worker.id}</p>
          </div>
        </div>
        
        <h4 className="font-medium text-warehouse-dark mb-3">Schedule for Today</h4>
        
        <div className="space-y-4">
          {worker.tasks.map((task) => (
            <div 
              key={task.task_id} 
              className="border border-gray-200 rounded-lg p-4 hover:border-warehouse-blue/30 hover:bg-warehouse-blue/5 transition-colors"
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{task.task_type}</h4>
                <Badge variant="outline">Task #{task.task_id}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-warehouse-gray">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatTime(task.start_time)} - {formatTime(task.end_time)}
                  </span>
                </div>
                
                {task.assigned_dock && (
                  <div className="flex items-center space-x-2 text-warehouse-gray">
                    <Truck className="h-4 w-4" />
                    <span>Dock {task.assigned_dock}</span>
                  </div>
                )}
              </div>
              
              <Separator className="my-3" />
              
              <div>
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 mr-2 text-warehouse-gray" />
                  <span className="text-sm font-medium">Working with:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.assigned_workers
                    .filter(id => id !== worker.id)
                    .map((workerId, index) => (
                      <Badge key={index} variant="secondary">
                        {workerId}
                      </Badge>
                    ))}
                  {task.assigned_workers.length === 1 && (
                    <span className="text-sm text-warehouse-gray italic">No other workers</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Worker Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-warehouse-gray">Tasks Today</p>
              <p className="font-semibold">{worker.tasks.length}</p>
            </div>
            <div>
              <p className="text-sm text-warehouse-gray">Efficiency Score</p>
              <p className="font-semibold">0.84</p>
            </div>
            <div>
              <p className="text-sm text-warehouse-gray">Total Hours</p>
              <p className="font-semibold">7.5h</p>
            </div>
            <div>
              <p className="text-sm text-warehouse-gray">Utilization</p>
              <p className="font-semibold">92%</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" className="mr-2">View History</Button>
        <Button size="sm">Full Profile</Button>
      </CardFooter>
    </Card>
  );
};

export default WorkerDetails;
