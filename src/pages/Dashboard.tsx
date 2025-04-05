// src/pages/Dashboard.tsx // Or wherever your Dashboard component is

// Remove useState for currentView if only using OperationsPlanning
// import { useState } from 'react'; 
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
// Import the new component
import { OperationsPlanning } from '@/components/dashboard/OperationsPlanning'; 
// Keep MetricsCards
import MetricsCards from '@/components/dashboard/MetricsCards';

const Dashboard = () => {
  // Remove state and handler if DashboardHeader no longer controls view switching
  // const [currentView, setCurrentView] = useState<'schedule' | 'truck'>('schedule');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900"> {/* Adjusted background */}
      <Navbar />
      
      <main className="flex-grow py-6">
        {/* Use container-fluid or similar for wider content if needed */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Example using Tailwind container */}
        
          {/* Pass only necessary props, or remove onViewChange if not used */}
          <DashboardHeader 
            // onViewChange={setCurrentView} 
            // currentView={currentView} 
          />
          
          {/* Keep metrics */}
          <MetricsCards /> 
          
          {/* Render the new Operations Planning component */}
          <OperationsPlanning /> 
          
          {/* Remove the old conditional rendering */}
          {/* {currentView === 'schedule' ? <ScheduleView /> : <TruckView />} */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
