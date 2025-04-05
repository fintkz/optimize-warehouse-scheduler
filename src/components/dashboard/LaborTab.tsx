// src/components/dashboard/LaborTab.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Users, BarChart2, Clock, Package, Box, Truck as LoadingIcon, ArrowDownSquare } from 'lucide-react'; // Added more specific icons
import { Progress } from "@/components/ui/progress"; // For utilization bar maybe

// --- Interfaces ---
// Assuming basic structures passed via props
// (These might eventually come from a shared types/schemas definition)
interface ScheduleRequest {
    workers?: string[] | null;
}
interface Summary {
    avg_worker_utilization_percent?: number | string | null;
}
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
    // required_wave_ids: string[]; // Not directly needed here
}
interface Wave {
    wave_id: string;
    wave_start: string;
    wave_end: string;
    tasks: number;
    assigned_workers_count: number;
}

interface LaborTabProps {
    scheduleRequest: ScheduleRequest | null;
    summary: Summary | null;
    inboundSchedule: InboundTask[];
    outboundSchedule: OutboundTask[];
    waveSchedule: Wave[];
    // Pass shift boundaries for hourly calculations
    shiftStart: Date | null; 
    shiftEnd: Date | null;
}

// --- Constants (Should ideally match backend) ---
const WORKER_REQS = { unloading: 2, putaway: 2, loading: 4 }; 
const SHIFT_DURATION_HOURS = 8; // Assuming standard 8h shift for hourly breakdown

// --- Helper Functions ---
const parseSafeDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;
    try {
        const dt = new Date(dateString);
        return isNaN(dt.getTime()) ? null : dt; // Check if date is valid
    } catch (e) {
        return null;
    }
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

    // --- Basic Stats ---
    const workerList = scheduleRequest?.workers || [];
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

    // --- Calculate Workload per Task Type ---
    const taskTypeWorkload = useMemo(() => {
        console.log("Calculating task type workload..."); // Debug log
        const workload = {
            Unloading: { totalWorkerMinutes: 0, taskCount: 0 },
            Putaway: { totalWorkerMinutes: 0, taskCount: 0 },
            Picking: { totalWorkerMinutes: 0, taskCount: 0 }, // From waves
            Loading: { totalWorkerMinutes: 0, taskCount: 0 },
        };

        (inboundSchedule || []).forEach(task => {
            const unloadStart = parseSafeDate(task.unloading_start);
            const unloadEnd = parseSafeDate(task.unloading_end);
            const putawayStart = parseSafeDate(task.putaway_start);
            const putawayEnd = parseSafeDate(task.putaway_end);
            
            const unloadDuration = calculateDurationMinutes(unloadStart, unloadEnd);
            const putawayDuration = calculateDurationMinutes(putawayStart, putawayEnd);

            if(unloadDuration > 0) {
                 workload.Unloading.totalWorkerMinutes += unloadDuration * WORKER_REQS.unloading;
                 workload.Unloading.taskCount += 1; // Count each truck's unload as one 'task' here
            }
            if(putawayDuration > 0) {
                 workload.Putaway.totalWorkerMinutes += putawayDuration * WORKER_REQS.putaway;
                 workload.Putaway.taskCount += 1;
            }
        });

        (waveSchedule || []).forEach(wave => {
            const waveStart = parseSafeDate(wave.wave_start);
            const waveEnd = parseSafeDate(wave.wave_end);
            const waveDuration = calculateDurationMinutes(waveStart, waveEnd);
            if(waveDuration > 0 && wave.assigned_workers_count > 0) {
                 workload.Picking.totalWorkerMinutes += waveDuration * wave.assigned_workers_count;
                 workload.Picking.taskCount += wave.tasks; // Sum individual picking tasks
            }
        });

        (outboundSchedule || []).forEach(task => {
             const loadStart = parseSafeDate(task.loading_start);
             const loadEnd = parseSafeDate(task.loading_end);
             const loadDuration = calculateDurationMinutes(loadStart, loadEnd);
             if(loadDuration > 0) {
                  workload.Loading.totalWorkerMinutes += loadDuration * WORKER_REQS.loading;
                  workload.Loading.taskCount += 1; // Count each truck's load as one 'task'
             }
        });
        
        // Convert minutes to hours for display maybe, or keep as minutes
        // Example: workload.Unloading.totalWorkerHours = workload.Unloading.totalWorkerMinutes / 60;

        console.log("Task Workload Calculated:", workload); // Debug log
        return workload;

    }, [inboundSchedule, outboundSchedule, waveSchedule]);


    // --- Calculate Hourly Workload Breakdown ---
    const hourlyBreakdown = useMemo(() => {
        console.log("Calculating hourly breakdown..."); // Debug log
        if (!shiftStart || !shiftEnd) {
            console.log("Shift start/end missing, cannot calculate hourly breakdown.");
            return Array(SHIFT_DURATION_HOURS).fill({ hour: "N/A", tasks: 0, workerMinutes: 0 });
        }

        const breakdown: { hour: string; tasks: number; workerMinutes: number }[] = [];
        const shiftStartHour = shiftStart.getHours();

        for (let i = 0; i < SHIFT_DURATION_HOURS; i++) {
            const hourStartTime = new Date(shiftStart);
            hourStartTime.setHours(shiftStartHour + i, 0, 0, 0); // Start of the hour block
            const hourEndTime = new Date(hourStartTime);
            hourEndTime.setHours(hourStartTime.getHours() + 1); // End of the hour block

            let tasksInHour = 0;
            let workerMinutesInHour = 0;

            // Helper to add task contribution to the hour
            const addTaskToHour = (taskStart: Date | null, taskEnd: Date | null, workers: number) => {
                 if (!taskStart || !taskEnd || taskEnd <= taskStart || workers <= 0) return;
                 
                 // Find overlap between task interval and hour interval
                 const overlapStart = Math.max(taskStart.getTime(), hourStartTime.getTime());
                 const overlapEnd = Math.min(taskEnd.getTime(), hourEndTime.getTime());

                 if (overlapEnd > overlapStart) {
                      tasksInHour += 1; // Count this task as active in this hour
                      const overlapDurationMinutes = (overlapEnd - overlapStart) / (1000 * 60);
                      workerMinutesInHour += overlapDurationMinutes * workers;
                 }
            };

            // Check Inbound Unloading
            (inboundSchedule || []).forEach(task => {
                 addTaskToHour(parseSafeDate(task.unloading_start), parseSafeDate(task.unloading_end), WORKER_REQS.unloading);
            });
             // Check Inbound Putaway
            (inboundSchedule || []).forEach(task => {
                 addTaskToHour(parseSafeDate(task.putaway_start), parseSafeDate(task.putaway_end), WORKER_REQS.putaway);
            });
             // Check Waves (Picking)
             (waveSchedule || []).forEach(wave => {
                 addTaskToHour(parseSafeDate(wave.wave_start), parseSafeDate(wave.wave_end), wave.assigned_workers_count);
             });
             // Check Outbound Loading
             (outboundSchedule || []).forEach(task => {
                 addTaskToHour(parseSafeDate(task.loading_start), parseSafeDate(task.loading_end), WORKER_REQS.loading);
             });

            breakdown.push({
                hour: `${hourStartTime.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: false })} - ${hourEndTime.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: false })}`,
                tasks: tasksInHour, // Number of distinct task intervals active
                workerMinutes: Math.round(workerMinutesInHour), // Total worker-minutes consumed
            });
        }
        console.log("Hourly Breakdown Calculated:", breakdown); // Debug log
        return breakdown;

    }, [inboundSchedule, outboundSchedule, waveSchedule, shiftStart, shiftEnd]);


    // --- Render Component ---
    return (
        <div className="space-y-6">
             {/* Overall Metrics */}
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

             {/* Planned Workload by Task Type */}
             <Card>
                 <CardHeader className="pb-2">
                     <CardTitle className="text-base font-medium">Planned Workload by Task Type</CardTitle>
                     <p className="text-xs text-muted-foreground">Total worker-minutes allocated per activity.</p>
                 </CardHeader>
                 <CardContent>
                     {/* Display actual calculated values */}
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                         <div className="p-3 rounded-md border bg-emerald-50 dark:bg-emerald-900/30">
                             <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-center"><Package className="h-4 w-4 mr-1"/>Picking</p>
                             <p className="text-xs text-muted-foreground mt-1">Tasks: {taskTypeWorkload.Picking.taskCount}</p>
                             <p className="text-xs text-muted-foreground">~{Math.round(taskTypeWorkload.Picking.totalWorkerMinutes)} Worker-Min</p>
                         </div>
                         <div className="p-3 rounded-md border bg-sky-50 dark:bg-sky-900/30">
                              <p className="text-sm font-semibold text-sky-700 dark:text-sky-400 flex items-center justify-center"><Box className="h-4 w-4 mr-1"/>Putaway</p>
                              <p className="text-xs text-muted-foreground mt-1">Trucks: {taskTypeWorkload.Putaway.taskCount}</p>
                              <p className="text-xs text-muted-foreground">~{Math.round(taskTypeWorkload.Putaway.totalWorkerMinutes)} Worker-Min</p>
                         </div>
                         <div className="p-3 rounded-md border bg-amber-50 dark:bg-amber-900/30">
                              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center justify-center"><LoadingIcon className="h-4 w-4 mr-1"/>Loading</p>
                              <p className="text-xs text-muted-foreground mt-1">Trucks: {taskTypeWorkload.Loading.taskCount}</p>
                              <p className="text-xs text-muted-foreground">~{Math.round(taskTypeWorkload.Loading.totalWorkerMinutes)} Worker-Min</p>
                         </div>
                         <div className="p-3 rounded-md border bg-indigo-50 dark:bg-indigo-900/30">
                              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 flex items-center justify-center"><ArrowDownSquare className="h-4 w-4 mr-1"/>Unloading</p>
                              <p className="text-xs text-muted-foreground mt-1">Trucks: {taskTypeWorkload.Unloading.taskCount}</p>
                              <p className="text-xs text-muted-foreground">~{Math.round(taskTypeWorkload.Unloading.totalWorkerMinutes)} Worker-Min</p>
                         </div>
                     </div>
                 </CardContent>
             </Card>

            {/* Worker Demand Timeline / Hourly Breakdown */}
             <Card>
                 <CardHeader className="pb-2">
                     <CardTitle className="text-base font-medium flex items-center">
                         <BarChart2 className="h-5 w-5 mr-2 text-primary"/> Planned Hourly Workload
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Total worker-minutes scheduled within each hour.</p>
                      <div className="space-y-1">
                         {hourlyBreakdown.map(item => (
                             <div key={item.hour} className="flex justify-between items-center text-sm p-2 border-b last:border-b-0">
                                 <span><Clock className="inline h-4 w-4 mr-1 text-muted-foreground"/>{item.hour}</span>
                                 {/* Show worker-minutes instead of peak workers */}
                                 <span className="font-medium">{item.workerMinutes} Worker-Min</span>
                             </div>
                         ))}
                      </div>
                 </CardContent>
             </Card>
        </div>
    );
}