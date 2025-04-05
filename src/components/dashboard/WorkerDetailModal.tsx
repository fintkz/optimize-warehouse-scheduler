// src/components/dashboard/WorkerDetailModal.tsx
import React from 'react';
// Assuming Shadcn/ui Dialog component for modal
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose, // Import DialogClose if using it inside for a button
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

// Re-define or import necessary types
interface InboundTask { /* ... */ }
interface OutboundTask { /* ... */ }
interface Wave { /* ... */ }

interface WorkerDetailModalProps {
    workerId: string;
    inboundSchedule: InboundTask[];
    outboundSchedule: OutboundTask[];
    waveSchedule: Wave[];
    onClose: () => void; // Function to close the modal
}

// Helper to format time (can be shared)
const formatTime = (isoString: string | null | undefined): string => {
    if (!isoString) return "N/A";
    try {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) { return "Invalid"; }
};


export function WorkerDetailModal({ 
    workerId, 
    inboundSchedule, 
    outboundSchedule, 
    waveSchedule, 
    onClose 
}: WorkerDetailModalProps) {

    // --- Logic to find tasks assigned to this worker ---
    // NOTE: This is complex because the current OR-Tools model doesn't assign
    // *specific* workers to tasks/waves. It only constrains the *total number*.
    // To show actual assignments, the backend solver model would need enhancement,
    // or we could make assumptions here (e.g., assume worker *could* have done any task
    // active when fewer than max workers were busy - this is inaccurate).

    // Placeholder: For now, just display worker ID and acknowledge limitations.
    const assignedTasksPlaceholder = [
        { id: "unload-1", type: "Unloading", time: "07:22 - 07:52", related: "Truck 26800" },
        { id: "wave-1", type: "Picking", time: "08:00 - 10:30", related: "Wave_Hr10" },
        { id: "load-1", type: "Loading", time: "10:30 - 11:30", related: "Truck 264" },
    ]; // Replace with real data if backend provides it

    return (
         <Dialog open={true} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}> 
             <DialogContent className="sm:max-w-[600px]"> {/* Adjust width */}
                 <DialogHeader>
                     <DialogTitle>Worker Details: {workerId}</DialogTitle>
                     <DialogDescription>
                         Planned tasks and involvement for this worker during the shift.
                         <br/>
                         <span className="text-xs text-destructive">Note: Specific task assignment requires backend enhancement.</span>
                     </DialogDescription>
                 </DialogHeader>
                 
                 {/* Content of the modal */}
                 <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    <h4 className="font-semibold text-sm mb-2">Placeholder Assigned Tasks:</h4>
                    {assignedTasksPlaceholder.length > 0 ? (
                        assignedTasksPlaceholder.map(task => (
                            <div key={task.id} className="text-xs border-b pb-1 mb-1">
                                <span className="font-medium">{task.type}:</span> 
                                <span className="text-muted-foreground"> {task.time}</span> 
                                <span className="text-muted-foreground"> ({task.related})</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground">No specific tasks could be determined for this worker with current model.</p>
                    )}
                    {/* Add more details here later - e.g., total workload, efficiency? */}
                 </div>

                 <DialogFooter>
                      <Button type="button" variant="secondary" onClick={onClose}>
                          Close
                      </Button>
                      {/* Maybe add other actions later */}
                 </DialogFooter>
                 {/* Optional: Add explicit close button if Dialog primitive needs it */}
                 {/* <DialogClose asChild> 
                      <Button type="button" variant="ghost" size="icon" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                         <X className="h-4 w-4" />
                         <span className="sr-only">Close</span>
                      </Button>
                 </DialogClose> */}
             </DialogContent>
         </Dialog>
    );
}
