// src/components/dashboard/WaveScheduleTab.tsx
import React from 'react';
// Example using Shadcn Table components - adapt if using something else
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust import path
import { Badge } from "@/components/ui/badge"; // For status potentially
import { Progress } from "@/components/ui/progress"; // For progress bar potentially
import { useState, useMemo } from 'react';
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Hash } from "lucide-react";
import { Truck } from "lucide-react";


// Define the expected shape of a single wave item
interface Wave {
    wave_id: string;
    wave_start: string;
    wave_end: string;
    tasks: number;
    assigned_workers_count: number;
    associated_truck_ids: string[];
    // Add derived fields if needed later
    status?: 'Scheduled' | 'In Progress' | 'Completed' | 'Unknown';
    progress?: number;
}

interface WaveScheduleTabProps {
    waveData: Wave[];
}

// Helper to format time nicely
const formatTime = (isoString: string): string => {
    try {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
        return "Invalid Date";
    }
};

// Helper to determine status and progress
const getWaveStatusAndProgress = (startTime: string, endTime: string): { text: Wave['status']; variant: "default" | "secondary" | "destructive" | "outline"; progress: number } => {
    try {
        const now = new Date().getTime();
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const duration = end - start;

        if (now < start) return { text: "Scheduled", variant: "secondary", progress: 0 };
        if (now >= end) return { text: "Completed", variant: "outline", progress: 100 };
        if (now >= start && now < end && duration > 0) {
             const elapsed = now - start;
             const progress = Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100)));
             return { text: "In Progress", variant: "default", progress: progress };
        }
    } catch (e) { /* ignore */ }
    return { text: "Unknown", variant: "secondary", progress: 0 };
};


export function WaveScheduleTab({ waveData }: WaveScheduleTabProps) {

    const [searchTerm, setSearchTerm] = useState('');
    // Basic sorting state - could be expanded for multi-column etc.
    const [sortConfig, setSortConfig] = useState<{ key: keyof Wave | 'status' | null; direction: 'ascending' | 'descending' }>({ key: 'wave_start', direction: 'ascending' });

    const processedWaveData = useMemo(() => {
         // Add status and progress to each wave
         return waveData.map(wave => {
             const { text, progress } = getWaveStatusAndProgress(wave.wave_start, wave.wave_end);
             return { ...wave, status: text, progress: progress };
         });
    }, [waveData]);


    const filteredAndSortedWaves = useMemo(() => {
        let sortableItems = [...processedWaveData];

        // Filtering (simple example by wave_id)
        if (searchTerm) {
            sortableItems = sortableItems.filter(wave => 
                wave.wave_id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sorting
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                // Handle sorting by date/time or other fields
                if (sortConfig.key === 'wave_start' || sortConfig.key === 'wave_end') {
                    aValue = new Date(a[sortConfig.key] ?? 0).getTime();
                    bValue = new Date(b[sortConfig.key] ?? 0).getTime();
                } else if (sortConfig.key === 'status') {
                     // Define order for status text if needed
                     const statusOrder = { "In Progress": 1, "Scheduled": 2, "Completed": 3, "Unknown": 4 };
                     aValue = statusOrder[a.status ?? "Unknown"] ?? 99;
                     bValue = statusOrder[b.status ?? "Unknown"] ?? 99;
                }
                 else {
                    aValue = a[sortConfig.key] ?? 0; // Default to 0 or '' for comparison if null
                    bValue = b[sortConfig.key] ?? 0;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [processedWaveData, searchTerm, sortConfig]);
    
    const requestSort = (key: keyof Wave | 'status') => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Helper to render sorting indicator
    const getSortIndicator = (key: keyof Wave | 'status') => {
         if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />;
         return sortConfig.direction === 'ascending' ? 
             <ArrowUpDown className="ml-2 h-3 w-3" /> : // Or specific Up arrow
             <ArrowUpDown className="ml-2 h-3 w-3" />; // Or specific Down arrow
    };


    if (!waveData || waveData.length === 0) {
        return <div className="text-center text-muted-foreground p-4">No wave data available for this schedule.</div>;
    }

    return (
        <div className="space-y-4">
            {/* Filters Section */}
            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-card items-center">
                 <Input 
                     type="search" 
                     placeholder="Search waves (by ID)..." 
                     className="h-9 text-sm max-w-xs"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 {/* Add other filters as needed (using Select components) */}
                  {/* Example Placeholder Selects */}
                 <Select> <SelectTrigger className="h-9 text-sm w-[150px]"><SelectValue placeholder="All Zones" /></SelectTrigger><SelectContent> {/* Add Items */} </SelectContent></Select>
                 <Select> <SelectTrigger className="h-9 text-sm w-[150px]"><SelectValue placeholder="All Priorities" /></SelectTrigger><SelectContent> {/* Add Items */} </SelectContent></Select>
                 <Select> <SelectTrigger className="h-9 text-sm w-[150px]"><SelectValue placeholder="All Statuses" /></SelectTrigger><SelectContent> {/* Add Items */} </SelectContent></Select>
                 
                 <div className="flex-grow"></div> {/* Spacer */}
                 <Button variant="outline" size="sm">Export</Button>
            </div>

            {/* Wave Table - More detailed */}
             <div className="border rounded-md overflow-hidden">
                 <Table>
                     <TableHeader>
                         <TableRow>
                            <TableHead className="w-[100px]"> {/* Start Time */}
                                 <Button variant="ghost" onClick={() => requestSort('wave_start')} className="px-1 h-auto text-xs font-semibold">
                                     <Clock className="mr-1 h-3 w-3" /> Start Time {getSortIndicator('wave_start')}
                                 </Button>
                             </TableHead>
                             {/* Removed End Time to match screenshot closer */}
                             <TableHead className="w-[150px]"> {/* Wave ID */}
                                  <Button variant="ghost" onClick={() => requestSort('wave_id')} className="px-1 h-auto text-xs font-semibold">
                                      Wave ID {getSortIndicator('wave_id')}
                                 </Button>
                             </TableHead>
                             <TableHead className="w-[120px]"> {/* Orders/Tasks */}
                                 <Button variant="ghost" onClick={() => requestSort('tasks')} className="px-1 h-auto text-xs font-semibold">
                                     <Hash className="mr-1 h-3 w-3" /> Tasks {getSortIndicator('tasks')}
                                 </Button>
                             </TableHead>
                              <TableHead className="w-[150px]">Trucks</TableHead> {/* Placeholder for Truck Info */}
                              <TableHead className="w-[120px]">Status</TableHead>
                             <TableHead className="w-[150px]">Progress</TableHead> {/* Progress Bar */}
                         </TableRow>
                     </TableHeader>
                     <TableBody>
                         {filteredAndSortedWaves.map((wave) => {
                            const status = getWaveStatusAndProgress(wave.wave_start, wave.wave_end);
                            return (
                                 <TableRow key={wave.wave_id}>
                                     <TableCell className="text-sm">{formatTime(wave.wave_start)}</TableCell>
                                     <TableCell className="font-medium text-sm">{wave.wave_id}</TableCell>
                                     <TableCell className="text-sm">{wave.tasks} tasks</TableCell>
                                     {/* Placeholder for associated trucks - maybe just count or icons */}
                                     <TableCell className="text-xs text-muted-foreground">
                                         <Truck className="inline h-3 w-3 mr-1" /> {wave.associated_truck_ids?.length || 0} trucks
                                     </TableCell>
                                     <TableCell>
                                         <Badge variant={status.variant} className="text-xs">{status.text}</Badge>
                                     </TableCell>
                                     <TableCell>
                                         <Progress value={status.progress} className="h-2" />
                                         <span className="text-xs ml-2 text-muted-foreground">{status.progress}%</span>
                                     </TableCell>
                                 </TableRow>
                             );
                         })}
                     </TableBody>
                 </Table>
            </div>
            {filteredAndSortedWaves.length === 0 && (
                <div className="text-center text-muted-foreground p-4">No waves match the current filters.</div>
            )}
        </div>
    );
}