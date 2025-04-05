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

// Define the expected shape of a single wave item
interface Wave {
    wave_id: string;
    wave_start: string;
    wave_end: string;
    tasks: number;
    assigned_workers_count: number;
    associated_truck_ids: string[];
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

// Helper to determine status (example logic)
const getWaveStatus = (startTime: string, endTime: string): { text: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
    try {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return { text: "Scheduled", variant: "secondary" };
        if (now >= start && now < end) return { text: "In Progress", variant: "default" };
        if (now >= end) return { text: "Completed", variant: "outline" };
    } catch (e) {
        // ignore date parsing errors for status
    }
    return { text: "Unknown", variant: "secondary" };
};


export function WaveScheduleTab({ waveData }: WaveScheduleTabProps) {

    if (!waveData || waveData.length === 0) {
        return <div className="text-center text-muted-foreground p-4">No wave data available for this schedule.</div>;
    }

    // TODO: Add state and handlers for filtering/sorting later
    // const [searchTerm, setSearchTerm] = useState('');
    // const [sortConfig, setSortConfig] = useState<{ key: keyof Wave | null; direction: 'ascending' | 'descending' }>({ key: 'wave_start', direction: 'ascending' });
    // const filteredAndSortedWaves = waveData.filter(...).sort(...);

    return (
        <div className="space-y-4">
            {/* Placeholder for Filters */}
            <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-card">
                 <input type="search" placeholder="Search waves..." className="p-2 border rounded text-sm min-w-[200px]"/>
                 {/* Add other filters like date (though data is for one shift), status etc. */}
                 <button className="px-3 py-1 border rounded text-sm hover:bg-accent">Apply Filters</button>
                 <div className="flex-grow"></div> {/* Spacer */}
                 <button className="px-3 py-1 border rounded text-sm bg-primary text-primary-foreground hover:bg-primary/90">Export</button>
            </div>

            {/* Wave Table */}
             <div className="border rounded-md">
                 <Table>
                     <TableHeader>
                         <TableRow>
                             <TableHead className="w-[100px]">Start</TableHead>
                             <TableHead className="w-[100px]">End</TableHead>
                             <TableHead>Wave ID</TableHead>
                             <TableHead className="text-right">Tasks</TableHead>
                             <TableHead className="text-right">Workers</TableHead>
                             <TableHead>Status</TableHead>
                             {/* Add progress or other columns if needed */}
                         </TableRow>
                     </TableHeader>
                     <TableBody>
                         {/* Replace waveData with filteredAndSortedWaves when implementing */}
                         {waveData.map((wave) => {
                            const status = getWaveStatus(wave.wave_start, wave.wave_end);
                            return (
                                 <TableRow key={wave.wave_id}>
                                     <TableCell>{formatTime(wave.wave_start)}</TableCell>
                                     <TableCell>{formatTime(wave.wave_end)}</TableCell>
                                     <TableCell className="font-medium">{wave.wave_id}</TableCell>
                                     <TableCell className="text-right">{wave.tasks}</TableCell>
                                     <TableCell className="text-right">{wave.assigned_workers_count}</TableCell>
                                     <TableCell>
                                         <Badge variant={status.variant}>{status.text}</Badge>
                                     </TableCell>
                                     {/* Example progress: <Progress value={status.text === 'Completed' ? 100 : (status.text === 'In Progress' ? 50 : 0)} className="w-[60%]" /> */}
                                 </TableRow>
                             );
                         })}
                     </TableBody>
                 </Table>
            </div>
        </div>
    );
}
