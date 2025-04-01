
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ScheduleView from '@/components/dashboard/ScheduleView';
import TruckView from '@/components/dashboard/TruckView';
import MetricsCards from '@/components/dashboard/MetricsCards';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<'schedule' | 'truck'>('schedule');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-6">
        <div className="container-lg">
          <DashboardHeader onViewChange={setCurrentView} currentView={currentView} />
          
          <MetricsCards />
          
          {currentView === 'schedule' ? <ScheduleView /> : <TruckView />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
