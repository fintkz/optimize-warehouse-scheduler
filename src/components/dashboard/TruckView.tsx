
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Truck, ArrowRight } from 'lucide-react';

// Mock types matching the API schema
interface TruckSchedule {
  truck_id: string;
  arrival_time: string;
  departure_time?: string;
  type: 'inbound' | 'outbound';
  tasks: TaskAssignment[];
}

interface TaskAssignment {
  task_id: string;
  task_type: string;
  start_time: string;
  end_time: string;
  assigned_workers: string[];
  assigned_dock?: number;
}

// Mock data
const mockTrucks: TruckSchedule[] = [
  {
    truck_id: 'TRK-001',
    arrival_time: '2024-08-26T08:15:00',
    departure_time: '2024-08-26T09:30:00',
    type: 'inbound',
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
        task_id: 'T2',
        task_type: 'Putaway',
        start_time: '2024-08-26T08:45:00',
        end_time: '2024-08-26T09:15:00',
        assigned_workers: ['GFLAMMIA', 'WORKER4']
      }
    ]
  },
  {
    truck_id: 'TRK-002',
    arrival_time: '2024-08-26T09:00:00',
    departure_time: '2024-08-26T11:30:00',
    type: 'outbound',
    tasks: [
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
    truck_id: 'TRK-003',
    arrival_time: '2024-08-26T10:30:00',
    departure_time: '2024-08-26T12:45:00',
    type: 'inbound',
    tasks: [
      {
        task_id: 'T6',
        task_type: 'Unloading',
        start_time: '2024-08-26T11:00:00',
        end_time: '2024-08-26T11:30:00',
        assigned_workers: ['WORKER5', 'WORKER6'],
        assigned_dock: 1
      }
    ]
  },
  {
    truck_id: 'TRK-004',
    arrival_time: '2024-08-26T11:45:00',
    type: 'outbound',
    tasks: [
      {
        task_id: 'T7',
        task_type: 'Loading',
        start_time: '2024-08-26T12:00:00',
        end_time: '2024-08-26T13:00:00',
        assigned_workers: ['WORKER7', 'WORKER8'],
        assigned_dock: 4
      }
    ]
  }
];

// Utility function to format time from ISO string
const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const TruckView = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Trucks</TabsTrigger>
              <TabsTrigger value="inbound">Inbound</TabsTrigger>
              <TabsTrigger value="outbound">Outbound</TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-warehouse-gray">
              Total: <span className="font-medium">{mockTrucks.length} trucks</span>
            </div>
          </div>
        
          <TabsContent value="all" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 divide-y divide-gray-100">
                  {mockTrucks.map((truck) => (
                    <div key={truck.truck_id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Truck className={`h-5 w-5 ${truck.type === 'inbound' ? 'text-blue-500' : 'text-indigo-500'}`} />
                          <h3 className="text-lg font-medium">{truck.truck_id}</h3>
                          <Badge variant={truck.type === 'inbound' ? 'default' : 'secondary'}>
                            {truck.type === 'inbound' ? 'Inbound' : 'Outbound'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2 md:mt-0">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-warehouse-gray mr-1" />
                            <span className="text-sm">
                              {formatTime(truck.arrival_time)}
                              {truck.departure_time && (
                                <>
                                  <ArrowRight className="inline h-3 w-3 mx-1" />
                                  {formatTime(truck.departure_time)}
                                </>
                              )}
                            </span>
                          </div>
                          
                          <Button variant="outline" size="sm">Details</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        {truck.tasks.map((task) => (
                          <div 
                            key={task.task_id} 
                            className="bg-gray-50 rounded-md p-3 border border-gray-100"
                          >
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{task.task_type}</span>
                              {task.assigned_dock && (
                                <Badge variant="outline" className="font-normal">
                                  Dock {task.assigned_dock}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-sm text-warehouse-gray">
                              {formatTime(task.start_time)} - {formatTime(task.end_time)}
                            </div>
                            
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {task.assigned_workers.map((worker, index) => (
                                <Badge key={index} variant="secondary" className="bg-gray-100">
                                  {worker}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inbound" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 divide-y divide-gray-100">
                  {mockTrucks
                    .filter(truck => truck.type === 'inbound')
                    .map((truck) => (
                      <div key={truck.truck_id} className="p-4 hover:bg-gray-50 transition-colors">
                        {/* Same layout as above */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-blue-500" />
                            <h3 className="text-lg font-medium">{truck.truck_id}</h3>
                            <Badge>Inbound</Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2 md:mt-0">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-warehouse-gray mr-1" />
                              <span className="text-sm">
                                {formatTime(truck.arrival_time)}
                                {truck.departure_time && (
                                  <>
                                    <ArrowRight className="inline h-3 w-3 mx-1" />
                                    {formatTime(truck.departure_time)}
                                  </>
                                )}
                              </span>
                            </div>
                            
                            <Button variant="outline" size="sm">Details</Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          {truck.tasks.map((task) => (
                            <div 
                              key={task.task_id} 
                              className="bg-gray-50 rounded-md p-3 border border-gray-100"
                            >
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">{task.task_type}</span>
                                {task.assigned_dock && (
                                  <Badge variant="outline" className="font-normal">
                                    Dock {task.assigned_dock}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="text-sm text-warehouse-gray">
                                {formatTime(task.start_time)} - {formatTime(task.end_time)}
                              </div>
                              
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {task.assigned_workers.map((worker, index) => (
                                  <Badge key={index} variant="secondary" className="bg-gray-100">
                                    {worker}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="outbound" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 divide-y divide-gray-100">
                  {mockTrucks
                    .filter(truck => truck.type === 'outbound')
                    .map((truck) => (
                      <div key={truck.truck_id} className="p-4 hover:bg-gray-50 transition-colors">
                        {/* Same layout as above */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-indigo-500" />
                            <h3 className="text-lg font-medium">{truck.truck_id}</h3>
                            <Badge variant="secondary">Outbound</Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2 md:mt-0">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-warehouse-gray mr-1" />
                              <span className="text-sm">
                                {formatTime(truck.arrival_time)}
                                {truck.departure_time && (
                                  <>
                                    <ArrowRight className="inline h-3 w-3 mx-1" />
                                    {formatTime(truck.departure_time)}
                                  </>
                                )}
                              </span>
                            </div>
                            
                            <Button variant="outline" size="sm">Details</Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          {truck.tasks.map((task) => (
                            <div 
                              key={task.task_id} 
                              className="bg-gray-50 rounded-md p-3 border border-gray-100"
                            >
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">{task.task_type}</span>
                                {task.assigned_dock && (
                                  <Badge variant="outline" className="font-normal">
                                    Dock {task.assigned_dock}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="text-sm text-warehouse-gray">
                                {formatTime(task.start_time)} - {formatTime(task.end_time)}
                              </div>
                              
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {task.assigned_workers.map((worker, index) => (
                                  <Badge key={index} variant="secondary" className="bg-gray-100">
                                    {worker}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Shift Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-warehouse-gray">Worker Utilization</span>
                  <span className="font-medium text-warehouse-dark">92%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-warehouse-gray">Average Truck Wait Time</span>
                  <span className="font-medium text-warehouse-dark">43 min</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-warehouse-gray">Efficiency Score</span>
                  <span className="font-medium text-warehouse-dark">0.87</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="font-medium mb-3">Worker Efficiency Scores</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-warehouse-blue/10 text-warehouse-blue flex items-center justify-center mr-2">
                        D
                      </div>
                      <span>DVIRGA</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      0.94
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-warehouse-blue/10 text-warehouse-blue flex items-center justify-center mr-2">
                        G
                      </div>
                      <span>GFLAMMIA</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      0.88
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-warehouse-blue/10 text-warehouse-blue flex items-center justify-center mr-2">
                        M
                      </div>
                      <span>MPIYA</span>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                      0.76
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TruckView;
