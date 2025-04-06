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
import { DockDetailModal } from './DockDetailModal'; 

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

    // --- Create Lookup Maps (Memoized) ---
    const inboundTruckMap = useMemo(() => {
        const map = new Map<string, InboundTruckInfo>();
        inboundSchedule.forEach(truck => { if(truck?.truck_id) map.set(truck.truck_id, truck); });
        return map;
    }, [inboundSchedule]);

    const outboundTruckMap = useMemo(() => {
        const map = new Map<string, OutboundTruckInfo>();
        outboundSchedule.forEach(truck => { if(truck?.truck_id) map.set(truck.truck_id, truck); });
        return map;
    }, [outboundSchedule]);

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
    const [selectedType, setSelectedType] = useState<'all' | 'inbound' | 'outbound'>('all'); // State for type filter
    // const [utilizationFilter, setUtilizationFilter] = useState('all'); // Example state for util filter
    const [selectedDockInfo, setSelectedDockInfo] = useState<CalculatedDockInfo | null>(null); // State for modal

    // --- Filter Docks for Display ---
    const filteredDocks = useMemo(() => {
        return calculatedDockInfoList.filter(dock => {
            const searchLower = searchTerm.toLowerCase();
            
            // Type Filter
            if (selectedType !== 'all' && dock.type !== selectedType) {
                return false;
            }

            // Search Filter (Dock ID or Assigned Truck ID)
            let searchMatch = false;
            if (!searchLower) {
                searchMatch = true; // No search term means match
            } else {
                 searchMatch = dock.dock_id.toLowerCase().includes(searchLower) ||
                               dock.assignments.some(a => a.truck_id?.toLowerCase().includes(searchLower));
            }
            if (!searchMatch) return false;

            // TODO: Add Utilization Filter Logic if implementing
            // if (utilizationFilter === '>80' && (dock.utilizationPercent ?? 0) <= 80) return false;
            // if (utilizationFilter === '<20' && (dock.utilizationPercent ?? 0) >= 20) return false;

            return true; // Include if all filters pass
        });
    }, [calculatedDockInfoList, searchTerm, selectedType /*, utilizationFilter */ ]);

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

    // --- Modal Handlers ---
    const handleDockClick = (dockInfo: CalculatedDockInfo) => {
        setSelectedDockInfo(dockInfo);
    };

    const handleCloseModal = () => {
        setSelectedDockInfo(null);
    };

    // --- Component Return (JSX Tree) ---
    return (
        <div className="space-y-4 relative"> {/* Ensure relative positioning if modal is absolutely positioned */}
            {/* Summary Cards - Updated for Planning View */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 text-center text-xs md:text-sm">
                 <Card className="p-3"><CardTitle className="text-lg">{summaryStats.totalDockCount}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Total Docks</CardContent></Card>
                 <Card className="p-3"><CardTitle className="text-lg">{summaryStats.inboundAssignments}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Inbound Tasks</CardContent></Card>
                 <Card className="p-3"><CardTitle className="text-lg">{summaryStats.outboundAssignments}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Outbound Tasks</CardContent></Card>
                 <Card className="p-3"><CardTitle className="text-lg">{summaryStats.totalAssignments}</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Total Assignments</CardContent></Card>
                 <Card className="p-3"><CardTitle className="text-lg">{summaryStats.avgUtilization ?? 'N/A'}%</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Avg Dock Util.</CardContent></Card>
                 <Card className="p-3"><CardTitle className="text-lg">~{Math.round(summaryStats.totalBusyMinutes / 60)} hr</CardTitle><CardContent className="p-0 mt-1 text-muted-foreground">Total Busy Time</CardContent></Card>
            </div>

             {/* Filters Section (Updated Selects) */}
            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-card items-center">
                 <div className="relative">
                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input 
                         type="search" placeholder="Search dock or truck ID..." 
                         className="h-9 text-sm pl-8 w-full max-w-xs"
                         value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                     />
                 </div>
                 {/* Type Filter Select */}
                 <Select value={selectedType} onValueChange={(value: 'all' | 'inbound' | 'outbound') => setSelectedType(value)}> 
                     <SelectTrigger className="h-9 text-sm w-[150px]"><SelectValue placeholder="All Types" /></SelectTrigger>
                     <SelectContent> 
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="inbound">Inbound</SelectItem>
                        <SelectItem value="outbound">Outbound</SelectItem>
                     </SelectContent>
                 </Select>
                 {/* Placeholder Utilization Filter */}
                 <Select /* value={utilizationFilter} onValueChange={setUtilizationFilter} */ > 
                     <SelectTrigger className="h-9 text-sm w-[150px]" disabled><SelectValue placeholder="Utilization Filter" /></SelectTrigger> {/* Disabled for now */}
                     <SelectContent> 
                         <SelectItem value="all">All Utilization</SelectItem>
                         {/* <SelectItem value=">80">High (>80%)</SelectItem> */}
                         {/* <SelectItem value="<20">Low (<20%)</SelectItem> */}
                    </SelectContent>
                 </Select>
                 {/* Add sort buttons later */}
            </div>

            {/* Dock List Table (Make Rows Clickable) */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Dock ID</TableHead>
                            <TableHead className="w-[100px]">Type</TableHead>
                            <TableHead className="w-[150px] text-center">Utilization</TableHead>
                            <TableHead className="w-[150px] text-center">Assignments</TableHead>
                            <TableHead className="w-[150px] text-center">Total Busy Time</TableHead>
                            {/* Removed explicit action header */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDocks.length > 0 ? filteredDocks.map(dock => (
                             <TableRow 
                                 key={dock.dock_id} 
                                 className="hover:bg-muted/50 cursor-pointer" // Add cursor-pointer
                                 onClick={() => handleDockClick(dock)} // Add onClick handler to the ROW
                                >
                                 <TableCell className="font-medium flex items-center"><Anchor className="h-4 w-4 mr-2 opacity-50"/>{dock.dock_id}</TableCell>
                                 <TableCell>
                                     {/* Using text instead of Badge for simplicity now, can add back */}
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${dock.type === 'inbound' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'}`}>
                                         {dock.type.charAt(0).toUpperCase() + dock.type.slice(1)}
                                     </span>
                                 </TableCell>
                                 <TableCell className="text-center text-sm">
                                     {dock.utilizationPercent !== null ? `${dock.utilizationPercent}%` : 'N/A'}
                                     {/* Optional: Mini progress bar inline */}
                                     {/* <Progress value={dock.utilizationPercent ?? 0} className="h-1 mt-1 w-16 mx-auto"/> */}
                                 </TableCell>
                                 <TableCell className="text-center text-sm">{dock.assignmentCount}</TableCell>
                                 <TableCell className="text-center text-sm">{dock.totalBusyMinutes} min</TableCell>
                             </TableRow>
                         )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    {calculatedDockInfoList.length === 0 ? "No docks scheduled for use." : "No docks match filters."}
                                </TableCell>
                            </TableRow>
                         )}
                    </TableBody>
                </Table>
            </div>

            {/* Conditionally Render Modal */}
            {selectedDockInfo && (
                <DockDetailModal 
                    dockInfo={selectedDockInfo} 
                    onClose={handleCloseModal} 
                    // Pass truck lookup maps needed inside modal
                    inboundTruckMap={inboundTruckMap} 
                    outboundTruckMap={outboundTruckMap}
                />
            )}
        </div>
    );
}