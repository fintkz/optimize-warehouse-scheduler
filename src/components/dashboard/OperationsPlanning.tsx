// src/components/dashboard/OperationsPlanning.tsx
import React from 'react';
import { useScheduleData } from '../../hooks/useScheduleData'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Adjust path

// Import the specific tab content components (create files below)
import { WaveScheduleTab } from './WaveScheduleTab'; 
import { DockScheduleTab } from './DockScheduleTab'; 
import { LaborTab } from './LaborTab'; // Assuming we create this

export function OperationsPlanning() {
    const { data: scheduleData, isLoading, error, refetch } = useScheduleData();

    // --- Loading and Error States ---
    if (isLoading) {
        return <div className="p-4 text-center">Loading schedule data...</div>;
    }
    if (error) {
        return (
            <div className="p-4 m-4 border rounded-md bg-destructive/10 text-destructive text-center">
                Error loading schedule: {error} 
                <button 
                    onClick={refetch} 
                    className="ml-4 px-3 py-1 border border-destructive rounded text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                    Retry
                </button>
            </div>
        );
    }
    if (!scheduleData) {
        return <div className="p-4 text-center text-muted-foreground">No schedule data available.</div>;
    }

    // --- Prepare Data for Tabs (with defaults) ---
    const waveSchedule = scheduleData.wave_schedule || [];
    const dockSchedule = scheduleData.dock_schedule || { inbound_docks: [], outbound_docks: [] };
    const workers = scheduleData.schedule_request?.workers || []; // May be null if not fetched initially
    const summary = scheduleData.summary || {};

    return (
        <div className="operations-planning mt-6"> 
            {/* Prompt Box Placeholder - Can be moved/removed */}
            <div className="mb-4 p-4 border rounded-md bg-card text-card-foreground shadow-sm">
                 <textarea 
                    className="w-full p-2 border rounded mb-2 text-sm bg-background" 
                    placeholder="Enter prompt (e.g., 'show available docks') - Placeholder" 
                    rows={2}
                 />
                 <div className="flex justify-end space-x-2">
                     <button className="px-3 py-1 border rounded text-sm bg-primary text-primary-foreground hover:bg-primary/90">Apply</button>
                     <button className="px-3 py-1 border rounded text-sm hover:bg-accent">Save</button>
                 </div>
                 <div className="text-xs text-muted-foreground mt-2">
                     Example Prompts | Syntax Help | Saved Prompts 
                 </div>
             </div>

            {/* --- Tabs --- */}
            <Tabs defaultValue="waves" className="w-full"> 
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="labor">Labor</TabsTrigger>
                    <TabsTrigger value="waves">Waves</TabsTrigger>
                    <TabsTrigger value="docks">Docks</TabsTrigger>
                </TabsList>
                
                {/* Labor Tab Content */}
                <TabsContent value="labor" className="mt-4">
                     <LaborTab workers={workers} summary={summary} />
                </TabsContent>

                {/* Waves Tab Content */}
                <TabsContent value="waves" className="mt-4">
                     <WaveScheduleTab waveData={waveSchedule} />
                </TabsContent>

                {/* Docks Tab Content */}
                <TabsContent value="docks" className="mt-4">
                     <DockScheduleTab dockData={dockSchedule} />
                </TabsContent>
            </Tabs>
        </div>
    );
}