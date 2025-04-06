// src/components/dashboard/OperationsPlanning.tsx
import React from 'react';
import { useScheduleData } from '../../hooks/useScheduleData'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Adjust path if needed
import { Button } from "@/components/ui/button"; // For Retry button

// Import the specific tab content components
import { WaveScheduleTab } from './WaveScheduleTab'; 
import { DockScheduleTab } from './DockScheduleTab'; 
import { LaborTab } from './LaborTab'; 
import MetricsCards from './MetricsCards';

// Define known shift times (should match backend/schemas)
const SHIFT_TIMES_FRONTEND: Record<string, [string, string]> = {
    'A': ['07:00:00', '15:00:00'], 
    'B': ['15:00:00', '23:00:00'], 
    'C': ['23:00:00', '07:00:00'] 
};

export function OperationsPlanning() {
    const { data: scheduleData, isLoading, error, refetch } = useScheduleData();

    // --- Loading State ---
    if (isLoading) {
        return <div className="p-6 text-center text-muted-foreground animate-pulse">Loading schedule data...</div>;
    }

    // --- Error State ---
    if (error) {
        return (
            <div className="p-4 m-4 border rounded-md bg-destructive/10 text-destructive text-center">
                <p className="font-semibold">Error Loading Schedule</p>
                <p className="text-sm mb-3">{error}</p> 
                <Button 
                    onClick={refetch} 
                    variant="destructive"
                    size="sm"
                >
                    Retry Fetch
                </Button>
            </div>
        );
    }

    // --- No Data State ---
    if (!scheduleData) {
        return <div className="p-6 text-center text-muted-foreground">No schedule data available. Check API or data source.</div>;
    }

    // --- Prepare Data and Shift Boundaries ---
    const waveSchedule = scheduleData.wave_schedule || [];
    const dockSchedule = scheduleData.dock_schedule || { inbound_docks: [], outbound_docks: [] };
    const inboundSchedule = scheduleData.inbound_schedule || [];
    const outboundSchedule = scheduleData.outbound_schedule || [];
    const scheduleRequest = scheduleData.schedule_request || {}; // Use empty object as default
    const summary = scheduleData.summary || {};

    // Derive shiftStart/End Date objects for passing to LaborTab
    let derivedShiftStart: Date | null = null;
    let derivedShiftEnd: Date | null = null;

    if (scheduleRequest.date && scheduleRequest.shift && SHIFT_TIMES_FRONTEND[scheduleRequest.shift.toUpperCase()]) {
        try {
            const shiftKey = scheduleRequest.shift.toUpperCase() as keyof typeof SHIFT_TIMES_FRONTEND;
            const [startStr, endStr] = SHIFT_TIMES_FRONTEND[shiftKey];
            const baseDate = scheduleRequest.date; // YYYY-MM-DD

            derivedShiftStart = new Date(`${baseDate}T${startStr}`);
            derivedShiftEnd = new Date(`${baseDate}T${endStr}`);

            // Adjust for overnight shift based on start/end times defined
            if (derivedShiftEnd <= derivedShiftStart) {
                derivedShiftEnd.setDate(derivedShiftEnd.getDate() + 1);
                 // Adjust start date only if needed (e.g., C shift logic from backend)
                 // Check if start time is late (like 23:00) compared to typical day start
                 if (derivedShiftStart.getHours() >= 20) { 
                     // This logic assumes a C shift starting day before the 'date' field might need adjustment based on exact backend logic
                     // If 'date' always refers to the day the *majority* of the shift occurs on, this might be okay.
                     // If 'date' refers to the calendar day the shift *starts* on, C might need start date adjusted back.
                     // Let's log to check
                     console.log(`Shift C detected (Start: ${derivedShiftStart}, End: ${derivedShiftEnd}). Start date might need adjustment depending on backend 'date' definition.`);
                     // Example adjustment if needed:
                     // derivedShiftStart.setDate(derivedShiftStart.getDate() - 1); 
                 }
            }
            console.log("Derived Shift Start for Tabs:", derivedShiftStart);
            console.log("Derived Shift End for Tabs:", derivedShiftEnd);

        } catch (e) {
             console.error("Error deriving shift Date objects in OperationsPlanning:", e);
             // Keep them null if error occurs
             derivedShiftStart = null;
             derivedShiftEnd = null;
        }
    } else {
         console.warn("Schedule request data missing date/shift, cannot derive shift times accurately.");
    }


    return (
        <div className="operations-planning mt-6"> 
            {/* Pass summary data AND derived worker count to MetricsCards */}
            <MetricsCards 
                 summary={summary} 
                 workerCount={scheduleRequest?.workers?.length ?? null} 
            />

            {/* Prompt Box Placeholder (as before) */}
            <div className="mt-6 mb-6 p-4 border rounded-md bg-card text-card-foreground shadow-sm"> 
                <textarea 
                    className="w-full p-2 border rounded mb-2 text-sm bg-background focus:ring-primary focus:border-primary" 
                    placeholder="Enter prompt (e.g., 'show available docks') - Placeholder / Future Feature" 
                    rows={2}
                    disabled 
                 />
                 <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground mt-2 space-x-3">
                          <span>Example Prompts</span> 
                          <span>|</span>
                          <span>Syntax Help</span> 
                          <span>|</span>
                          <span>Saved Prompts</span> 
                     </div>
                     <div className="flex space-x-2">
                         <Button variant="outline" size="sm" disabled>Save</Button>
                         <Button size="sm" disabled>Apply</Button>
                     </div>
                 </div>
             </div>

            {/* --- Tabs --- */}
            <Tabs defaultValue="waves" className="w-full"> 
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="labor">Labor</TabsTrigger> 
                    <TabsTrigger value="waves">Waves</TabsTrigger>
                    <TabsTrigger value="docks">Docks</TabsTrigger>
                </TabsList>
                
                {/* Labor Tab Content - Passing necessary props */}
                <TabsContent value="labor" className="mt-4">
                     <LaborTab 
                         scheduleRequest={scheduleRequest} 
                         summary={summary}
                         inboundSchedule={inboundSchedule} 
                         outboundSchedule={outboundSchedule}
                         waveSchedule={waveSchedule}
                         shiftStart={derivedShiftStart} 
                         shiftEnd={derivedShiftEnd}
                     />
                </TabsContent>

                {/* Waves Tab Content - Passing necessary props */}
                <TabsContent value="waves" className="mt-4">
                     <WaveScheduleTab waveData={waveSchedule} />
                </TabsContent>

                {/* Docks Tab Content - Passing necessary props */}
                <TabsContent value="docks" className="mt-4">
                     <DockScheduleTab dockData={dockSchedule} />
                     {/* Pass schedules if needed later for lookups */}
                     {/* <DockScheduleTab dockData={dockSchedule} inboundSchedule={inboundSchedule} outboundSchedule={outboundSchedule} /> */}
                </TabsContent>
            </Tabs>
        </div>
    );
} // End of OperationsPlanning component
