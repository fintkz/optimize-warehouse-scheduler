// src/components/dashboard/DockScheduleTab.tsx
import React, { useMemo, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Using Card component
import { Input } from "@/components/ui/input"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Button } from "@/components/ui/button"; 
import { Truck, Anchor, CalendarDays, Clock } from 'lucide-react'; // Icons
import { Hash } from "lucide-react";


// Interface matching the structure from the API response
interface DockAssignment {
    truck_id: string | null;
    task_type: string;
    start_time: string;
    end_time: string;
}

interface DockScheduleDetail {
    dock_id: string;
    assignments: DockAssignment[];
}

interface DockScheduleData {
    inbound_docks: DockScheduleDetail[];
    outbound_docks: DockScheduleDetail[];
}

interface DockScheduleTabProps {
    dockData: DockScheduleData;
    // We might need inbound/outbound schedules later to look up truck details
    // inboundSchedule: any[]; 
    // outboundSchedule: any[];
}

// Helper to format time/date concisely
const formatDockTime = (isoString: string): string => {
    try {
        const dt = new Date(isoString);
        // Example: Apr 1, 20:41
        return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ', ' +
               dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) { return "Invalid"; }
};

// Helper to calculate duration string (very basic)
const formatDuration = (startTimeStr: string, endTimeStr: string, status: string): string => {
     if (status !== 'Occupied') return '-'; // Only show duration for currently occupied? Or show scheduled length?
    try {
        const start = new Date(startTimeStr).getTime();
        const now = new Date().getTime();
        const diffMinutes = Math.round((now - start) / (1000 * 60));

        if (diffMinutes < 1) return "< 1 min ago";
        if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;
        if (diffHours < 24) return `about ${diffHours}h ${remainingMinutes}m ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `about ${diffDays} days ago`;

    } catch (e) { return "-"; }
};

// Helper to determine dock status (Simplified)
const getDockStatus = (assignments: DockAssignment[], dockType: 'inbound' | 'outbound'): { 
    text: string; 
    // *** FIX: Use variants supported by Badge ***
    variant: "destructive" | "secondary" | "default" | "outline"; 
    currentTruck: string | null; 
    nextAssignmentStart: string | null; // Added for potential 'Reserved' logic
} => {
    const now = new Date();
    let currentTruckId = null;
    let isOccupied = false;
    let nextStartTime: Date | null = null;
    let nextAssignTruck: string | null = null;

    for (const assign of assignments) {
        try {
            const start = new Date(assign.start_time);
            const end = new Date(assign.end_time);
            
            // Check if currently occupied
            if (now >= start && now < end) {
                currentTruckId = assign.truck_id;
                isOccupied = true;
                break; // Found current occupation, no need to check further for status
            }
            
            // Find the earliest *future* assignment start time
            if (start > now) {
                if (nextStartTime === null || start < nextStartTime) {
                    nextStartTime = start;
                    nextAssignTruck = assign.truck_id;
                }
            }

        } catch(e) { /* ignore invalid dates */ }
    }

    if (isOccupied) {
        return { text: "Occupied", variant: "destructive", currentTruck: currentTruckId, nextAssignmentStart: null };
    }

    if (nextStartTime) {
        // If there's a future assignment, mark as reserved
         // *** FIX: Map "Reserved" to "outline" variant ***
        return { text: "Reserved", variant: "outline", currentTruck: nextAssignTruck, nextAssignmentStart: nextStartTime.toISOString() };
    }

    // If no current or future assignments found
    return { text: "Available", variant: "secondary", currentTruck: null, nextAssignmentStart: null };
};


export function DockScheduleTab({ dockData }: DockScheduleTabProps) {

    // Filter out docks with no assignments
    const usedInboundDocks = useMemo(() => 
        dockData?.inbound_docks?.filter(dock => dock.assignments?.length > 0) || [], 
        [dockData]
    );
    const usedOutboundDocks = useMemo(() => 
        dockData?.outbound_docks?.filter(dock => dock.assignments?.length > 0) || [],
        [dockData]
    );
    
    const allUsedDocks = useMemo(() => [...usedInboundDocks, ...usedOutboundDocks], [usedInboundDocks, usedOutboundDocks]);

    // --- States for Filtering/Searching (Placeholders) ---
    const [searchTerm, setSearchTerm] = useState('');
    // ... add states for location, type, status filters ...

    const filteredDocks = useMemo(() => {
        return allUsedDocks.filter(dock => 
            dock.dock_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dock.assignments.some(a => a.truck_id?.toLowerCase().includes(searchTerm.toLowerCase()))
            // Add more filter conditions here based on state
        );
    }, [allUsedDocks, searchTerm /*, other filter states */ ]);

    // --- Summary Cards Data (Derived) ---
    const totalPositions = (dockData?.inbound_docks?.length || 0) + (dockData?.outbound_docks?.length || 0);
    // Note: Status derivation below is basic, real logic might be more complex
    let availableCount = 0;
    let occupiedCount = 0;
    let reservedCount = 0; // Placeholder
    let inboundCount = 0;
    let outboundCount = 0;
    
    const allDocksForStatus = (dockData?.inbound_docks || []).concat(dockData?.outbound_docks || []);
    allDocksForStatus.forEach(dock => {
        const statusInfo = getDockStatus(dock.assignments, dock.dock_id.startsWith("IN") ? 'inbound' : 'outbound');
        if(statusInfo.text === 'Available') availableCount++;
        if(statusInfo.text === 'Occupied') occupiedCount++;
        if(statusInfo.text === 'Reserved') reservedCount++; // Placeholder
        
        if(statusInfo.text === 'Occupied') { // Count occupied type
             if (dock.dock_id.startsWith("IN")) inboundCount++;
             else outboundCount++;
        }
    });
    
    // Adjust available count if total doesn't match
     availableCount = totalPositions - occupiedCount - reservedCount; 


     return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 text-center text-xs md:text-sm">
                 <Card className="p-3"><CardTitle className="text-lg">{totalPositions}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Total Positions</CardContent></Card>
                 <Card className="p-3 bg-green-50 dark:bg-green-900/30"><CardTitle className="text-lg text-green-700 dark:text-green-400">{availableCount}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Available</CardContent></Card>
                 <Card className="p-3 bg-red-50 dark:bg-red-900/30"><CardTitle className="text-lg text-red-700 dark:text-red-400">{occupiedCount}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Occupied</CardContent></Card>
                 <Card className="p-3 bg-yellow-50 dark:bg-yellow-900/20"><CardTitle className="text-lg text-yellow-600 dark:text-yellow-400">{reservedCount}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Reserved</CardContent></Card>
                 <Card className="p-3 bg-blue-50 dark:bg-blue-900/30"><CardTitle className="text-lg text-blue-700 dark:text-blue-400">{inboundCount}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Inbound</CardContent></Card>
                 <Card className="p-3 bg-purple-50 dark:bg-purple-900/30"><CardTitle className="text-lg text-purple-700 dark:text-purple-400">{outboundCount}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Outbound</CardContent></Card>
            </div>

             {/* Filters Section */}
            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-card items-center">
                 <Input 
                     type="search" 
                     placeholder="Search by dock, truck..." 
                     className="h-9 text-sm max-w-xs"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <Select> <SelectTrigger className="h-9 text-sm w-[150px]"><SelectValue placeholder="All Locations" /></SelectTrigger><SelectContent> {/* Items */} </SelectContent></Select>
                 <Select> <SelectTrigger className="h-9 text-sm w-[150px]"><SelectValue placeholder="All Types" /></SelectTrigger><SelectContent> {/* Items */} </SelectContent></Select>
                 <Select> <SelectTrigger className="h-9 text-sm w-[150px]"><SelectValue placeholder="All Statuses" /></SelectTrigger><SelectContent> {/* Items */} </SelectContent></Select>
                 {/* Add sort buttons later */}
            </div>

            {/* Dock List - Render Cards */}
            <div className="space-y-3">
                 {filteredDocks.map(dock => {
                     const dockType = dock.dock_id.startsWith("IN") ? 'inbound' : 'outbound';
                     const statusInfo = getDockStatus(dock.assignments, dockType);
                     // Find the specific assignment that determines the current status 
                     // (Simplistic: finds first matching truck if multiple assignments exist for same truck - unlikely with schedule)
                     const relevantAssignment = dock.assignments.find(a => a.truck_id === statusInfo.currentTruck); 

                     return (
                         <Card key={dock.dock_id} className={`shadow-sm border ${
                             statusInfo.text === 'Occupied' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50' 
                             : statusInfo.text === 'Reserved' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50' 
                             : 'bg-card border-border' // Default background for Available
                             }`}>
                             <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                                 <CardTitle className="text-base font-medium flex items-center">
                                     <Anchor className="h-4 w-4 mr-2 text-muted-foreground"/> {dock.dock_id}
                                 </CardTitle>
                                 <Badge variant={statusInfo.variant} className="text-xs capitalize">{statusInfo.text}</Badge> 
                             </CardHeader>
                             
                             {/* Content for Occupied or Reserved Docks */}
                             {(statusInfo.text === 'Occupied' || statusInfo.text === 'Reserved') && relevantAssignment && (
                                <CardContent className="px-4 pb-3 text-xs space-y-2">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1">
                                        <div>
                                             <p className="text-muted-foreground">Trailer/Container</p>
                                             <p className="font-medium flex items-center"><Truck className="h-3 w-3 mr-1"/>{relevantAssignment.truck_id ?? 'N/A'}</p>
                                         </div>
                                         <div>
                                             <p className="text-muted-foreground">Carrier</p>
                                             <p className="font-medium">{'Placeholder'}</p> {/* Data not available */}
                                         </div>
                                        <div>
                                             <p className="text-muted-foreground">Type</p>
                                             {/* Display Inbound/Outbound based on dock type? */}
                                             <p className="font-medium">{dockType === 'inbound' ? 'Inbound' : 'Outbound'}</p> 
                                         </div>
                                         <div>
                                             <p className="text-muted-foreground">Duration</p>
                                             {/* Show duration only if occupied */}
                                             <p className="font-medium">{statusInfo.text === 'Occupied' ? formatDuration(relevantAssignment.start_time, relevantAssignment.end_time, statusInfo.text) : '-'}</p>
                                         </div>
                                        <div className="col-span-2 sm:col-span-2">
                                             <p className="text-muted-foreground">Arrival/Scheduled</p>
                                             {/* TODO: Look up actual Arrival/Scheduled Departure */}
                                             <p className="font-medium flex items-center"><CalendarDays className="h-3 w-3 mr-1"/>{'Lookup Needed'}</p> 
                                         </div>
                                         <div className="col-span-2 sm:col-span-2">
                                             <p className="text-muted-foreground">{statusInfo.text === 'Reserved' ? 'Reserved From' : 'Started At'}</p>
                                             <p className="font-medium flex items-center"><Clock className="h-3 w-3 mr-1"/>{formatDockTime(relevantAssignment.start_time)}</p> 
                                         </div>
                                     </div>
                                 </CardContent>
                              )}
                              
                              {/* Content for Available Docks */}
                               {statusInfo.text === 'Available' && (
                                 <CardContent className="px-4 pb-3 text-xs text-muted-foreground">
                                     Dock is currently free. Next assignment not found within horizon.
                                 </CardContent>
                               )}
                         </Card>
                     );
                 })}
                 {/* Message if no docks match filters */}
                  {filteredDocks.length === 0 && allUsedDocks.length > 0 && (
                     <div className="text-center text-muted-foreground p-4 border rounded-md bg-card">No docks match the current filters.</div>
                 )}
                 {/* Message if no docks were used at all */}
                  {allUsedDocks.length === 0 && (
                     <div className="text-center text-muted-foreground p-4 border rounded-md bg-card">No docks are scheduled for use during this period.</div>
                 )}
            </div>
        </div>
    );
} // End of DockScheduleTab component