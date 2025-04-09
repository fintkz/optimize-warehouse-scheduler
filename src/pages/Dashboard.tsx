// src/pages/Dashboard.tsx 

import React, { useState, useCallback, useEffect } from 'react'; 
import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer'; 
import { ScheduleControlForm, ScheduleParams } from '@/components/dashboard/ScheduleControlForm'; 
import { OperationsPlanning } from '@/components/dashboard/OperationsPlanning'; 
import MetricsCards from '@/components/dashboard/MetricsCards'; 
import { ScheduleResponse } from '@/hooks/useScheduleData'; // Adjust path if needed
import { PREDEFINED_SCENARIOS, DEFAULT_SCENARIO_ID } from '@/config/scenarios'; // Adjust path if needed
import API_URL from '@/config/apiUrl';

const Dashboard = () => {
  
  const defaultScenario = PREDEFINED_SCENARIOS.find(s => s.id === DEFAULT_SCENARIO_ID) || PREDEFINED_SCENARIOS[0];

  // State for the *parameters* used in the LAST successful/pending fetch
  const [currentParams, setCurrentParams] = useState<ScheduleParams>({
      prefix: defaultScenario.prefix, date: defaultScenario.date, shift: defaultScenario.shift,
      docks_inbound: 10, docks_outbound: 10, max_workers_per_wave: 15,
  });
  
  // State for the API *result*
  const [scheduleData, setScheduleData] = useState<ScheduleResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading on mount
  const [error, setError] = useState<string | null>(null);

  // API Call Logic
  const fetchSchedule = useCallback(async (params: ScheduleParams) => {
      setIsLoading(true);
      setError(null);
      // Store the params that initiated this fetch
      setCurrentParams(params); // Keep track of what we asked for
      console.log("Fetching schedule data with params:", params); 

      try {
          const response = await fetch(API_URL, { /* ... POST request as before ... */ 
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
              body: JSON.stringify({...params, workers: null}), 
          });
          // ... (Error handling for response.ok as before) ...
          if (!response.ok) { /* ... throw error ... */ }

          const result: ScheduleResponse = await response.json();
          console.log("Schedule data received."); 
          setScheduleData(result); // Store the successful result

      } catch (err) { /* ... (Set error state, clear scheduleData) ... */ } 
      finally { setIsLoading(false); console.log("Fetching finished."); }
  }, []); // Stable function reference

  // Callback for the form
  const handleGeneratePlan = useCallback((params: ScheduleParams) => {
      fetchSchedule(params); // Trigger fetch with new params    
  }, [fetchSchedule]); 

  // Initial Fetch Effect
  useEffect(() => {
      console.log("Dashboard mounted. Fetching initial/default schedule...");
      // Fetch using the initial default parameters set in currentParams state
      fetchSchedule(currentParams); 
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSchedule]); // Run only once when fetchSchedule is created

  // --- Render ---
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"> 
      <Navbar />
      
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
          
          
          {/* Control Form is responsible for triggering updates */}
          <div className="mt-6">
             <ScheduleControlForm 
                 onGeneratePlan={handleGeneratePlan} 
                 isGenerating={isLoading} 
                 // Optional: Pass currentParams back if form needs to reflect last request
                 // initialParams={currentParams} 
             />
          </div>
          
          {/* --- Single MetricsCards instance --- */}
          {/* Displays data from the scheduleData state */}
          <div className="mt-6"> 
             {/* Show loading state specifically for metrics maybe */}
             {isLoading && !scheduleData && <div className="h-20 flex items-center justify-center text-muted-foreground">Loading metrics...</div> } 
             {/* Render cards if data exists or even if loading finished with error (to show N/A) */}
             {(!isLoading || scheduleData || error) && (
                 <MetricsCards 
                     // Use data from the latest successful fetch (scheduleData)
                     summary={scheduleData?.summary ?? null} 
                     // Derive worker count from the request ECHOED in the response
                     workerCount={scheduleData?.schedule_request?.workers?.length ?? null}
                 /> 
             )}
             {/* Display error related to metrics loading below cards? */}
             {error && !isLoading && <div className="text-center text-red-500 text-xs mt-2">Failed to load latest schedule data.</div> }
          </div>
          
          {/* --- Single OperationsPlanning instance --- */}
          {/* Displays detailed tabs based on scheduleData state */}
           <div className="mt-6">
              <OperationsPlanning 
                  // Pass the LATEST fetched data
                  scheduleData={scheduleData} 
                  isLoading={isLoading} // Pass loading state
                  error={error}         // Pass error state
                  // Provide refetch using the *last parameters used*
                  refetch={() => fetchSchedule(currentParams)} 
              />
           </div>
           
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;