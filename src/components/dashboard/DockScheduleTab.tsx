import React, { useMemo, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Input } from "@/components/ui/input"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Button } from "@/components/ui/button"; 
import { Truck, Anchor, CalendarDays, Clock, Search, Percent, List, TimerIcon } from 'lucide-react'; // Added icons
import { parseISO } from 'date-fns'; 
import { format } from 'date-fns'; 
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// --- Interfaces --- 
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

interface CalculatedDockInfo extends DockScheduleDetail {
    utilizationPercent: number | null;
    assignmentCount: number;
    totalBusyMinutes: number;
    type: 'inbound' | 'outbound';
}

interface DockScheduleData {
    inbound_docks: DockScheduleDetail[];
    outbound_docks: DockScheduleDetail[];
}

// Add interfaces for the schedule lists passed as props
interface InboundTruckInfo {
    truck_id: string;
    arrival_time: string;
}
interface OutboundTruckInfo {
    truck_id: string;
    scheduled_departure: string | null;
}

interface DockScheduleTabProps {
    dockData: DockScheduleData;
    inboundSchedule: InboundTruckInfo[]; 
    outboundSchedule: OutboundTruckInfo[];
    // Need shift boundaries to calculate utilization %
    shiftStart: Date | null; 
    shiftEnd: Date | null;
}

// --- Helper Functions ---

// Enhanced date parsing and formatting using date-fns
const parseSafeDate_Dock = (isoString: string | null | undefined): Date | null => {
    if (!isoString) return null;
    try {
        const dt = parseISO(isoString); // Use date-fns parser
        return isNaN(dt.getTime()) ? null : dt;
    } catch (e) {
        return null;
    }
};

const formatDockTime = (date: Date | null | undefined): string => {
    if (!date) return "N/A";
    try {
        // Example: Apr 1, 20:41
        return format(date, "MMM d, HH:mm"); 
    } catch (e) { return "Invalid Date"; }
};

const formatDuration = (startTime: Date | null, endTime: Date | null, status: string): string => {
     if (status !== 'Occupied' || !startTime) return '-'; 
    try {
        const start = startTime.getTime();
        const now = new Date().getTime();
        const diffMinutes = Math.round((now - start) / (1000 * 60));

        if (diffMinutes < 1) return "< 1 min";
        if (diffMinutes < 60) return `${diffMinutes} min ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;
        if (diffHours < 24) return `~${diffHours}h ${remainingMinutes}m ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `~${diffDays} days ago`;
    } catch (e) { return "-"; }
};

const getDockStatus = (assignments: DockAssignment[], dockType: 'inbound' | 'outbound'): { 
    text: 'Occupied' | 'Reserved' | 'Available'; 
    variant: "destructive" | "outline" | "secondary"; 
    currentTruckId: string | null; // Truck ID for occupied/reserved state
    relevantAssignment: DockAssignment | null; // The assignment determining the state
    nextAssignmentStart: Date | null; 
} => {
    const now = new Date();
    let isOccupied = false;
    let currentAssignment: DockAssignment | null = null;
    
    let nextStartTime: Date | null = null;
    let nextAssignment: DockAssignment | null = null;

    // Sort assignments by start time to make processing easier
    const sortedAssignments = [...assignments].sort((a, b) => {
        const dateA = parseSafeDate_Dock(a.start_time)?.getTime() ?? Infinity;
        const dateB = parseSafeDate_Dock(b.start_time)?.getTime() ?? Infinity;
        return dateA - dateB;
    });

    for (const assign of sortedAssignments) {
        const start = parseSafeDate_Dock(assign.start_time);
        const end = parseSafeDate_Dock(assign.end_time);

        if (!start || !end) continue; // Skip invalid assignments

        // Check if currently occupied
        if (now >= start && now < end) {
            isOccupied = true;
            currentAssignment = assign;
            break; // Found current occupation
        }
        
        // Find the earliest *future* assignment 
        if (start > now) {
            if (nextStartTime === null || start < nextStartTime) {
                nextStartTime = start;
                nextAssignment = assign;
            }
        }
    }

    if (isOccupied && currentAssignment) {
        return { 
            text: "Occupied", 
            variant: "destructive", 
            currentTruckId: currentAssignment.truck_id, 
            relevantAssignment: currentAssignment, 
            nextAssignmentStart: null // Not relevant when occupied
        };
    }

    if (nextStartTime && nextAssignment) {
        // If there's a future assignment, mark as reserved
        return { 
            text: "Reserved", 
            variant: "outline", // Using outline for Reserved
            currentTruckId: nextAssignment.truck_id, // Truck for the *next* assignment
            relevantAssignment: nextAssignment, // The *next* assignment details
            nextAssignmentStart: nextStartTime 
        };
    }

    // If no current or future assignments found
    return { 
        text: "Available", 
        variant: "secondary", 
        currentTruckId: null, 
        relevantAssignment: null, 
        nextAssignmentStart: null 
    };
};


// --- Component ---
export function DockScheduleTab({ 
    dockData, 
    inboundSchedule, 
    outboundSchedule,
    shiftStart,
    shiftEnd 
}: DockScheduleTabProps) {

    // --- Calculate Shift Duration ---
    const shiftDurationMinutes = useMemo(() => {
        if (!shiftStart || !shiftEnd || shiftEnd <= shiftStart) return null;
        return (shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60);
    }, [shiftStart, shiftEnd]);


    // --- Calculate Enhanced Dock Info (Memoized) ---
    const calculatedDockInfoList = useMemo(() => {
        console.log("Calculating enhanced dock info..."); // Debug
        const enhancedList: CalculatedDockInfo[] = [];
        const allDocksRaw = (dockData?.inbound_docks || []).concat(dockData?.outbound_docks || []);

        allDocksRaw.forEach(dock => {
            if (!dock || !dock.dock_id) return; // Skip invalid dock data

            let totalBusyMinutes = 0;
            let validAssignments = 0;

            (dock.assignments || []).forEach(assign => {
                const start = parseSafeDate_Dock(assign.start_time);
                const end = parseSafeDate_Dock(assign.end_time);
                
                if (start && end && end > start && shiftStart && shiftEnd) {
                     // Clip duration to shift window
                     const effective_start = Math.max(start.getTime(), shiftStart.getTime());
                     const effective_end = Math.min(end.getTime(), shiftEnd.getTime());
                     const duration = (effective_end - effective_start) / (1000 * 60);
                     if (duration > 0) {
                         totalBusyMinutes += duration;
                         validAssignments++;
                     }
                }
            });

            let utilizationPercent: number | null = null;
            if (shiftDurationMinutes && shiftDurationMinutes > 0) {
                 utilizationPercent = Math.round((totalBusyMinutes / shiftDurationMinutes) * 100);
            }

            enhancedList.push({
                ...dock, // Spread original assignments etc.
                utilizationPercent: utilizationPercent,
                assignmentCount: validAssignments, // Count only assignments contributing to busy time
                totalBusyMinutes: Math.round(totalBusyMinutes),
                type: dock.dock_id.startsWith("IN") ? 'inbound' : 'outbound'
            });
        });
        
         // Sort docks: Inbound first, then Outbound, then by number
        enhancedList.sort((a, b) => {
            const typeA = a.type === 'inbound' ? 0 : 1;
            const typeB = b.type === 'inbound' ? 0 : 1;
            if (typeA !== typeB) return typeA - typeB;
            const numA = parseInt(a.dock_id.split('_').pop() || '0');
            const numB = parseInt(b.dock_id.split('_').pop() || '0');
            return numA - numB;
        });
        console.log("Enhanced dock info calculated:", enhancedList.length); // Debug
        return enhancedList;

    }, [dockData, shiftStart, shiftEnd, shiftDurationMinutes]);
    
    // --- States for Filtering/Searching ---
    const [searchTerm, setSearchTerm] = useState('');
    // Add other filter states here (e.g., selectedStatus, selectedType)

    // --- Filter Docks for Display ---
    const filteredDocks = useMemo(() => {
        // Filter based on calculatedDockInfoList now
        return calculatedDockInfoList.filter(dock => {
            const searchLower = searchTerm.toLowerCase();
            // Check dock ID
            if (dock.dock_id.toLowerCase().includes(searchLower)) return true;
            // Maybe search assignment truck IDs if needed later
            // if (dock.assignments.some(a => a.truck_id?.toLowerCase().includes(searchLower))) return true;
            
            // TODO: Add checks for other filters 
            
            return !searchLower; // Show all if search is empty
        });
    }, [calculatedDockInfoList, searchTerm /*, other filter states */ ]);

    // --- Calculate Summary Cards Data ---
    const summaryStats = useMemo(() => {
        const totalAssignments = calculatedDockInfoList.reduce((sum, dock) => sum + dock.assignmentCount, 0);
        const totalBusyMinutes = calculatedDockInfoList.reduce((sum, dock) => sum + dock.totalBusyMinutes, 0);
        const totalDockCount = calculatedDockInfoList.length;
        const avgUtilization = shiftDurationMinutes && totalDockCount > 0 
            ? Math.round((totalBusyMinutes / (totalDockCount * shiftDurationMinutes)) * 100) 
            : 0;
        const inboundAssignments = calculatedDockInfoList
             .filter(d => d.type === 'inbound')
             .reduce((sum, dock) => sum + dock.assignmentCount, 0);
        const outboundAssignments = calculatedDockInfoList
             .filter(d => d.type === 'outbound')
             .reduce((sum, dock) => sum + dock.assignmentCount, 0);

        return {
            totalAssignments,
            totalBusyMinutes,
            avgUtilization,
            inboundAssignments,
            outboundAssignments,
            totalDockCount
        }
   }, [calculatedDockInfoList, shiftDurationMinutes]);
    // Ensure counts add up (adjust available if needed, though should be correct now)
    // availableCount = totalPositions - occupiedCount - reservedCount; 


    return (
        <div className="space-y-4">
            {/* Summary Cards - Updated for Planning View */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center text-xs md:text-sm">
                 <Card className="p-3"><CardTitle className="text-lg">{summaryStats.totalDockCount}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Total Docks</CardContent></Card>
                 <Card className="p-3"><CardTitle className="text-lg">{summaryStats.inboundAssignments}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Inbound Tasks</CardContent></Card>
                 <Card className="p-3"><CardTitle className="text-lg">{summaryStats.outboundAssignments}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Outbound Tasks</CardContent></Card>
                 <Card className="p-3"><CardTitle className="text-lg">{summaryStats.totalAssignments}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Total Assignments</CardContent></Card>
                 <Card className="p-3"><CardTitle className="text-lg">{summaryStats.avgUtilization ?? 'N/A'}%</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Avg Dock Util.</CardContent></Card>
                 {/* <Card className="p-3"><CardTitle className="text-lg">~{Math.round(summaryStats.totalBusyMinutes / 60)} hr</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Total Busy Time</CardContent></Card> */}
            </div>

             {/* Filters Section (Keep placeholders) */}
            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-card items-center">
                 <div className="relative">
                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input 
                         type="search" placeholder="Search dock ID..." 
                         className="h-9 text-sm pl-8 w-full max-w-xs"
                         value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                     />
                 </div>
                 <Select> <SelectTrigger className="h-9 text-sm w-[150px]"><SelectValue placeholder="All Types" /></SelectTrigger><SelectContent><SelectItem value="inbound">Inbound</SelectItem><SelectItem value="outbound">Outbound</SelectItem></SelectContent></Select>
                 <Select> <SelectTrigger className="h-9 text-sm w-[150px]"><SelectValue placeholder="Utilization" /></SelectTrigger><SelectContent> {/* e.g., >80%, <20% */} </SelectContent></Select>
                 {/* Add sort buttons later */}
            </div>

            {/* Dock List - Render Table/List View */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Dock ID</TableHead>
                            <TableHead className="w-[100px]">Type</TableHead>
                            <TableHead className="w-[150px] text-center">Utilization</TableHead>
                            <TableHead className="w-[150px] text-center">Assignments</TableHead>
                            <TableHead className="w-[150px] text-center">Total Busy Time</TableHead>
                            <TableHead className="w-[50px]"></TableHead> {/* For Action/Details Button */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDocks.length > 0 ? filteredDocks.map(dock => (
                             <TableRow key={dock.dock_id} className="hover:bg-muted/50">
                                 <TableCell className="font-medium flex items-center"><Anchor className="h-4 w-4 mr-2 opacity-50"/>{dock.dock_id}</TableCell>
                                 <TableCell>
                                     <Badge variant={dock.type === 'inbound' ? 'default' : 'secondary'}>{dock.type}</Badge>
                                 </TableCell>
                                 <TableCell className="text-center">
                                     {dock.utilizationPercent !== null ? `${dock.utilizationPercent}%` : 'N/A'}
                                     <Progress value={dock.utilizationPercent ?? 0} className="h-1.5 mt-1"/>
                                 </TableCell>
                                 <TableCell className="text-center">{dock.assignmentCount}</TableCell>
                                 <TableCell className="text-center">{dock.totalBusyMinutes} min</TableCell>
                                 <TableCell className="text-right">
                                     <Button 
                                         variant="ghost" 
                                         size="sm" 
                                         className="h-7 px-2"
                                         onClick={() => alert(`Details for ${dock.dock_id}:\n${JSON.stringify(dock.assignments, null, 2)}`)} // Placeholder Action
                                        >
                                         Details
                                     </Button>
                                 </TableCell>
                             </TableRow>
                         )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    {calculatedDockInfoList.length === 0 ? "No docks scheduled for use." : "No docks match filters."}
                                </TableCell>
                            </TableRow>
                         )}
                    </TableBody>
                </Table>
            </div>
            {/* Modal Placeholder for Dock Details */}
            {/* {selectedDockId && <DockDetailModal dockInfo={...} onClose={...}/>} */}
        </div>
    );
}