
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  onViewChange: (view: 'schedule' | 'truck') => void;
  currentView: 'schedule' | 'truck';
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onViewChange, currentView }) => {
  const [currentShift, setCurrentShift] = useState<'A' | 'B' | 'C'>('B');
  const [currentDate, setCurrentDate] = useState('2024-08-26');
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warehouse-dark">Warehouse Dashboard</h1>
          <p className="text-warehouse-gray">Optimize shifts and monitor operations</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-warehouse-gray" />
            <span className="text-warehouse-dark font-medium">{currentDate}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-warehouse-lightGray">
                <span>Shift {currentShift}</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCurrentShift('A')}>
                Shift A (00:00-08:00)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentShift('B')}>
                Shift B (08:00-16:00)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentShift('C')}>
                Shift C (16:00-00:00)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex rounded-md overflow-hidden border border-warehouse-lightGray">
            <Button 
              variant={currentView === 'schedule' ? 'default' : 'outline'} 
              className={`rounded-none border-0 ${currentView === 'schedule' ? 'bg-warehouse-blue' : ''}`}
              onClick={() => onViewChange('schedule')}
            >
              Schedule View
            </Button>
            <Button 
              variant={currentView === 'truck' ? 'default' : 'outline'} 
              className={`rounded-none border-0 ${currentView === 'truck' ? 'bg-warehouse-blue' : ''}`}
              onClick={() => onViewChange('truck')}
            >
              Truck View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
