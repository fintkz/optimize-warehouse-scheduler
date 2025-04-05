// src/components/dashboard/LaborTab.tsx
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Users, BarChart2, Clock, Package, Box, Truck as LoadingIcon, ArrowDownSquare, Search, UserCheck, Hourglass } from 'lucide-react'; 
import { Progress } from "@/components/ui/progress"; 
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 

// Import the modal component (create file below)
import { WorkerDetailModal } from './WorkerDetailModal'; 

// --- Interfaces ---
interface ScheduleRequest { workers?: string[] | null; }
interface Summary { avg_worker_utilization_percent?: number | string | null; }
interface InboundTask {
    truck_id: string;
    unloading_start: string;
    unloading_end: string;
    putaway_start: string;
    putaway_end: string;
}
interface OutboundTask {
    truck_id: string;
    loading_start: string;
    loading_end: string;
}
interface Wave {
    wave_id: string;
    wave_start: string;
    wave_end: string;
    tasks: number;
    assigned_workers_count: number;
    // Add other wave details if needed for modal
}

interface LaborTabProps {
    scheduleRequest: ScheduleRequest | null;
    summary: Summary | null;
    inboundSchedule: InboundTask[];
    outboundSchedule: OutboundTask[];
    waveSchedule: Wave[];
    shiftStart: Date | null; 
    shiftEnd: Date | null;
}

// --- Constants ---
const WORKER_REQS = { unloading: 2, putaway: 2, loading: 4 }; 
const SHIFT_DURATION_HOURS = 8; 

// --- Helper Functions ---
const parseSafeDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;
    try {
        const dt = new Date(dateString);
        return isNaN(dt.getTime()) ? null : dt; 
    } catch (e) { return null; }
};

const calculateDurationMinutes = (start: Date | null, end: Date | null): number => {
    if (!start || !end || end <= start) return 0;
    return (end.getTime() - start.getTime()) / (1000 * 60);
};

// --- Component ---
export function LaborTab({ 
    scheduleRequest, 
    summary, 
    inboundSchedule, 
    outboundSchedule, 
    waveSchedule,
    shiftStart,
    shiftEnd
}: LaborTabProps) {

    // --- State ---
    const [activeView, setActiveView] = useState<'hourly' | 'worker'>('hourly');
    const [workerSearchTerm, setWorkerSearchTerm] = useState('');
    const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null); // For modal trigger

    // --- Memoized Calculations ---
    const workerList = useMemo(() => scheduleRequest?.workers || [], [scheduleRequest]);
    const numWorkers = workerList.length;
    
    const workerUtilRaw = summary?.avg_worker_utilization_percent;
    let workerUtilDisplay: string;
    let workerUtilValue: number | null = null;
    if (typeof workerUtilRaw === 'number') {
        workerUtilValue = workerUtilRaw;
        workerUtilDisplay = `${workerUtilRaw.toFixed(1)}%`;
    } else {
        workerUtilDisplay = String(workerUtilRaw || 'N/A');
    }

    const taskTypeWorkload = useMemo(() => {
        const workload = {
            Unloading: { totalWorkerMinutes: 0, taskCount: 0 }, Putaway: { totalWorkerMinutes: 0, taskCount: 0 },
            Picking: { totalWorkerMinutes: 0, taskCount: 0 }, Loading: { totalWorkerMinutes: 0, taskCount: 0 },
        };
        (inboundSchedule || []).forEach(task => {
            const unloadDuration = calculateDurationMinutes(parseSafeDate(task.unloading_start), parseSafeDate(task.unloading_end));
            const putawayDuration = calculateDurationMinutes(parseSafeDate(task.putaway_start), parseSafeDate(task.putaway_end));
            if(unloadDuration > 0) { workload.Unloading.totalWorkerMinutes += unloadDuration * WORKER_REQS.unloading; workload.Unloading.taskCount += 1; }
            if(putawayDuration > 0) { workload.Putaway.totalWorkerMinutes += putawayDuration * WORKER_REQS.putaway; workload.Putaway.taskCount += 1; }
        });
        (waveSchedule || []).forEach(wave => {
            const waveDuration = calculateDurationMinutes(parseSafeDate(wave.wave_start), parseSafeDate(wave.wave_end));
            if(waveDuration > 0 && wave.assigned_workers_count > 0) { workload.Picking.totalWorkerMinutes += waveDuration * wave.assigned_workers_count; workload.Picking.taskCount += wave.tasks; }
        });
        (outboundSchedule || []).forEach(task => {
             const loadDuration = calculateDurationMinutes(parseSafeDate(task.loading_start), parseSafeDate(task.loading_end));
             if(loadDuration > 0) { workload.Loading.totalWorkerMinutes += loadDuration * WORKER_REQS.loading; workload.Loading.taskCount += 1; }
        });
        return workload;
    }, [inboundSchedule, outboundSchedule, waveSchedule]);

    const hourlyBreakdown = useMemo(() => {
        if (!shiftStart || !shiftEnd) return [];
        const breakdown: { hour: string; tasks: number; workerMinutes: number }[] = [];
        const shiftStartHour = shiftStart.getHours();

        const addTaskToHour = (taskStart: Date | null, taskEnd: Date | null, workers: number, hourStartTime: Date, hourEndTime: Date) => {
            if (!taskStart || !taskEnd || taskEnd <= taskStart || workers <= 0) return { taskAdded: false, minutesAdded: 0 };
            const overlapStart = Math.max(taskStart.getTime(), hourStartTime.getTime());
            const overlapEnd = Math.min(taskEnd.getTime(), hourEndTime.getTime());
            if (overlapEnd > overlapStart) {
                const overlapDurationMinutes = (overlapEnd - overlapStart) / (1000 * 60);
                return { taskAdded: true, minutesAdded: overlapDurationMinutes * workers };
            }
            return { taskAdded: false, minutesAdded: 0 };
        };

        for (let i = 0; i < SHIFT_DURATION_HOURS; i++) {
            const hourStartTime = new Date(shiftStart);
            hourStartTime.setHours(shiftStartHour + i, 0, 0, 0);
            const hourEndTime = new Date(hourStartTime);
            hourEndTime.setHours(hourStartTime.getHours() + 1);
            let tasksInHour = 0;
            let workerMinutesInHour = 0;

            (inboundSchedule || []).forEach(task => {
                const unloadResult = addTaskToHour(parseSafeDate(task.unloading_start), parseSafeDate(task.unloading_end), WORKER_REQS.unloading, hourStartTime, hourEndTime);
                if(unloadResult.taskAdded) tasksInHour++; workerMinutesInHour += unloadResult.minutesAdded;
                const putawayResult = addTaskToHour(parseSafeDate(task.putaway_start), parseSafeDate(task.putaway_end), WORKER_REQS.putaway, hourStartTime, hourEndTime);
                 if(putawayResult.taskAdded && !unloadResult.taskAdded) tasksInHour++; // Avoid double counting task if both phases overlap hour
                 workerMinutesInHour += putawayResult.minutesAdded;
            });
            (waveSchedule || []).forEach(wave => {
                 const waveResult = addTaskToHour(parseSafeDate(wave.wave_start), parseSafeDate(wave.wave_end), wave.assigned_workers_count, hourStartTime, hourEndTime);
                 if(waveResult.taskAdded) tasksInHour++; workerMinutesInHour += waveResult.minutesAdded;
             });
            (outboundSchedule || []).forEach(task => {
                 const loadResult = addTaskToHour(parseSafeDate(task.loading_start), parseSafeDate(task.loading_end), WORKER_REQS.loading, hourStartTime, hourEndTime);
                  if(loadResult.taskAdded) tasksInHour++; workerMinutesInHour += loadResult.minutesAdded;
             });

            breakdown.push({
                hour: `${hourStartTime.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: false })} - ${hourEndTime.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: false })}`,
                tasks: tasksInHour,
                workerMinutes: Math.round(workerMinutesInHour),
            });
        }
        return breakdown;
    }, [inboundSchedule, outboundSchedule, waveSchedule, shiftStart, shiftEnd]);

    const filteredWorkers = useMemo(() => {
        if (!workerSearchTerm) return workerList;
        return workerList.filter(worker => 
            worker.toLowerCase().includes(workerSearchTerm.toLowerCase())
        );
    }, [workerList, workerSearchTerm]);

    const handleWorkerClick = (workerId: string) => {
        console.log("Worker clicked:", workerId); // Log click
        setSelectedWorkerId(workerId); // Set state to open modal
    };

    const handleCloseModal = () => {
        setSelectedWorkerId(null); // Clear state to close modal
    };

    // --- Render Component ---
    return (
        <div className="space-y-6 relative"> {/* Added relative positioning for modal */}
             {/* Overall Metrics Card */}
             <Card>
                 <CardHeader className="pb-2">
                     <CardTitle className="text-base font-medium flex items-center">
                         <Users className="h-5 w-5 mr-2 text-primary"/> Labor Pool Overview
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="text-sm space-y-1">
                     <p className="text-muted-foreground">Total Workers Available: <span className="font-semibold text-foreground">{numWorkers}</span></p>
                     <div>
                         <p className="text-muted-foreground mb-1">Average Planned Utilization:</p>
                         <div className="flex items-center gap-2">
                              <Progress value={workerUtilValue ?? 0} className="h-2 w-32" />
                              <span className="font-semibold text-foreground">{workerUtilDisplay}</span>
                         </div>
                    </div>
                 </CardContent>
             </Card>

            {/* --- View Toggle and Content Card --- */}
             <Card>
                 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-base font-medium">Labor Allocation Details</CardTitle>
                      {/* View Toggle Buttons */}
                      <div className="flex space-x-1 rounded-md bg-secondary text-secondary-foreground p-1">
                          <Button variant={activeView === 'hourly' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveView('hourly')} className="h-7 px-2 text-xs"><Hourglass className="h-3.5 w-3.5 mr-1.5"/> Hourly View</Button>
                          <Button variant={activeView === 'worker' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveView('worker')} className="h-7 px-2 text-xs"><UserCheck className="h-3.5 w-3.5 mr-1.5"/> Worker View</Button>
                      </div>
                 </CardHeader>

                 {/* Conditional Content based on activeView */}
                 <CardContent className="mt-4">
                     {activeView === 'hourly' && (
                         <div className="space-y-6">
                              {/* Planned Workload by Task Type */}
                              <Card className="border-none shadow-none">
                                 <CardHeader className="p-0 pb-2"><CardTitle className="text-base font-medium">Planned Workload by Task Type</CardTitle></CardHeader>
                                 <CardContent className="p-0">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center pt-2">
                                         <div className="p-3 rounded-md border bg-emerald-50 dark:bg-emerald-900/30"><p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-center"><Package className="h-4 w-4 mr-1"/>Picking</p><p className="text-xs text-muted-foreground mt-1">Tasks: {taskTypeWorkload.Picking.taskCount}</p><p className="text-xs text-muted-foreground">~{Math.round(taskTypeWorkload.Picking.totalWorkerMinutes)} Worker-Min</p></div>
                                         <div className="p-3 rounded-md border bg-sky-50 dark:bg-sky-900/30"><p className="text-sm font-semibold text-sky-700 dark:text-sky-400 flex items-center justify-center"><Box className="h-4 w-4 mr-1"/>Putaway</p><p className="text-xs text-muted-foreground mt-1">Trucks: {taskTypeWorkload.Putaway.taskCount}</p><p className="text-xs text-muted-foreground">~{Math.round(taskTypeWorkload.Putaway.totalWorkerMinutes)} Worker-Min</p></div>
                                         <div className="p-3 rounded-md border bg-amber-50 dark:bg-amber-900/30"><p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center justify-center"><LoadingIcon className="h-4 w-4 mr-1"/>Loading</p><p className="text-xs text-muted-foreground mt-1">Trucks: {taskTypeWorkload.Loading.taskCount}</p><p className="text-xs text-muted-foreground">~{Math.round(taskTypeWorkload.Loading.totalWorkerMinutes)} Worker-Min</p></div>
                                         <div className="p-3 rounded-md border bg-indigo-50 dark:bg-indigo-900/30"><p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 flex items-center justify-center"><ArrowDownSquare className="h-4 w-4 mr-1"/>Unloading</p><p className="text-xs text-muted-foreground mt-1">Trucks: {taskTypeWorkload.Unloading.taskCount}</p><p className="text-xs text-muted-foreground">~{Math.round(taskTypeWorkload.Unloading.totalWorkerMinutes)} Worker-Min</p></div>
                                     </div>
                                 </CardContent>
                              </Card>
                             
                             {/* Worker Demand Timeline */}
                             <Card className="border-none shadow-none">
                                <CardHeader className="p-0 pb-2"><CardTitle className="text-base font-medium">Planned Hourly Workload</CardTitle></CardHeader>
                                <CardContent className="p-0">
                                     <p className="text-sm text-muted-foreground mb-3">Total worker-minutes scheduled within each hour.</p>
                                     <div className="space-y-1 border rounded-md p-2 max-h-60 overflow-y-auto">
                                         {hourlyBreakdown.map(item => (
                                             <div key={item.hour} className="flex justify-between items-center text-sm p-2 border-b last:border-b-0">
                                                 <span><Clock className="inline h-4 w-4 mr-1 text-muted-foreground"/>{item.hour}</span>
                                                 <span className="text-muted-foreground text-xs">{item.tasks} Tasks Active</span>
                                                 <span className="font-medium">{item.workerMinutes} Worker-Min</span>
                                             </div>
                                         ))}
                                    </div>
                                </CardContent>
                             </Card>
                         </div>
                     )}

                     {activeView === 'worker' && (
                         <div className="space-y-4">
                             {/* Worker Search Bar */}
                              <div className="relative">
                                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                      type="search" 
                                      placeholder="Search workers by ID..." 
                                      className="pl-8 w-full sm:w-64 h-9" 
                                      value={workerSearchTerm}
                                      onChange={(e) => setWorkerSearchTerm(e.target.value)}
                                  />
                              </div>
                             
                             {/* Worker List */}
                             <div className="border rounded-md max-h-[400px] overflow-y-auto"> {/* Increased height */}
                                 {filteredWorkers.length > 0 ? (
                                     filteredWorkers.map((workerId) => (
                                         <div 
                                             key={workerId} 
                                             className="flex items-center justify-between p-2 px-3 border-b last:border-b-0 text-sm hover:bg-muted/50 cursor-pointer"
                                             onClick={() => handleWorkerClick(workerId)} // Trigger modal open
                                         >
                                             <span>{workerId}</span>
                                             <span className="text-xs text-blue-600 hover:underline">View Details</span>
                                         </div>
                                     ))
                                 ) : (
                                     <p className="p-4 text-center text-muted-foreground">No workers found matching '{workerSearchTerm}'.</p>
                                 )}
                             </div>
                         </div>
                     )}
                 </CardContent>
             </Card>

            {/* --- Worker Detail Modal --- */}
            {/* Render modal conditionally based on selectedWorkerId */}
            {selectedWorkerId && (
                 <WorkerDetailModal 
                     workerId={selectedWorkerId} 
                     inboundSchedule={inboundSchedule}
                     outboundSchedule={outboundSchedule}
                     waveSchedule={waveSchedule}
                     onClose={handleCloseModal}
                 />
             )}

        </div>
    );
}