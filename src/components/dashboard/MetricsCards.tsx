
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Clock, TrendingUp } from 'lucide-react';

// Mock performance metrics
const metrics = {
  worker_utilization: 92.4,
  truck_wait_time: 43.2,
  total_wait_time_minutes: 345.6,
  efficiency_score: 0.87
};

const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Worker Utilization</CardTitle>
          <Users className="h-4 w-4 text-warehouse-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.worker_utilization}%</div>
          <p className="text-xs text-warehouse-gray mt-1">+5.2% from previous shift</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg. Truck Wait Time</CardTitle>
          <Clock className="h-4 w-4 text-warehouse-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.truck_wait_time} min</div>
          <p className="text-xs text-warehouse-gray mt-1">-12 min from previous shift</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Wait Time</CardTitle>
          <Clock className="h-4 w-4 text-warehouse-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.total_wait_time_minutes} min</div>
          <p className="text-xs text-warehouse-gray mt-1">Objective value from solver</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-warehouse-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.efficiency_score}</div>
          <p className="text-xs text-warehouse-gray mt-1">+0.03 from previous shift</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
