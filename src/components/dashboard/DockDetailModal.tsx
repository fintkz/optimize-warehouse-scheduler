// src/components/dashboard/DockDetailModal.tsx
import React from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Anchor, Truck, Clock, CalendarDays, Percent, List } from 'lucide-react'; // Icons
import { parseISO, format } from 'date-fns'; // Use date-fns

// --- Interfaces --- (match types used/passed)
interface DockAssignment { truck_id: string | null; task_type: string; start_time: string; end_time: string; }
interface InboundTruckInfo { truck_id: string; arrival_time: string; }
interface OutboundTruckInfo { truck_id: string; scheduled_departure: string | null; }
interface CalculatedDockInfo {
    dock_id: string;
    assignments: DockAssignment[];
    utilizationPercent: number | null;
    assignmentCount: number;
    totalBusyMinutes: number;
    type: 'inbound' | 'outbound';
}

interface DockDetailModalProps {
    dockInfo: CalculatedDockInfo | null;
    onClose: () => void; 
    inboundTruckMap: Map<string, InboundTruckInfo>;
    outboundTruckMap: Map<string, OutboundTruckInfo>;
}

// --- Helper Functions --- (Can be moved to utils)
const parseSafeDate_Modal = (isoString: string | null | undefined): Date | null => {
    if (!isoString) return null;
    try { const dt = parseISO(isoString); return isNaN(dt.getTime()) ? null : dt; } 
    catch (e) { return null; }
};

const formatModalTime = (date: Date | null | undefined): string => {
    if (!date) return "N/A";
    try { return format(date, "HH:mm"); } // Just time for modal?
    catch (e) { return "Invalid"; }
};
const formatModalDateTime = (date: Date | null | undefined): string => {
    if (!date) return "N/A";
    try { return format(date, "MMM d, HH:mm"); } // Date and Time
    catch (e) { return "Invalid"; }
};


export function DockDetailModal({ 
    dockInfo, 
    onClose, 
    inboundTruckMap, 
    outboundTruckMap 
}: DockDetailModalProps) {

    if (!dockInfo) return null; // Don't render if no dock selected

    // Sort assignments for display
    const sortedAssignments = [...dockInfo.assignments].sort((a, b) => {
        const dateA = parseSafeDate_Modal(a.start_time)?.getTime() ?? Infinity;
        const dateB = parseSafeDate_Modal(b.start_time)?.getTime() ?? Infinity;
        return dateA - dateB;
    });

    return (
         <Dialog open={true} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}> 
             <DialogContent className="sm:max-w-3xl"> {/* Wider modal */}
                 <DialogHeader>
                     <DialogTitle className="flex items-center">
                         <Anchor className="h-5 w-5 mr-2 text-primary"/> Dock Details: {dockInfo.dock_id} ({dockInfo.type})
                     </DialogTitle>
                     <DialogDescription>
                         Planned assignment schedule and statistics for this dock during the shift.
                     </DialogDescription>
                 </DialogHeader>
                 
                 {/* Summary Stats for this Dock */}
                 <div className="grid grid-cols-3 gap-4 text-sm my-4">
                      <div className="text-center p-2 border rounded-md">
                          <p className="text-muted-foreground text-xs">Utilization</p>
                          <p className="font-semibold text-lg">{dockInfo.utilizationPercent ?? 'N/A'}%</p>
                      </div>
                      <div className="text-center p-2 border rounded-md">
                           <p className="text-muted-foreground text-xs">Assignments</p>
                          <p className="font-semibold text-lg">{dockInfo.assignmentCount}</p>
                      </div>
                     <div className="text-center p-2 border rounded-md">
                           <p className="text-muted-foreground text-xs">Total Busy</p>
                          <p className="font-semibold text-lg">{dockInfo.totalBusyMinutes} min</p>
                      </div>
                 </div>

                 {/* Assignment Table */}
                 <div className="max-h-[50vh] overflow-y-auto border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Truck ID</TableHead>
                                <TableHead>Task</TableHead>
                                <TableHead>Planned Start</TableHead>
                                <TableHead>Planned End</TableHead>
                                <TableHead>Truck Arrival/Departure</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedAssignments.length > 0 ? sortedAssignments.map((assign, index) => {
                                let truckTimeInfo = "N/A";
                                if(assign.truck_id) {
                                    if(dockInfo?.type === 'inbound'){
                                        const truck = inboundTruckMap.get(assign.truck_id);
                                        truckTimeInfo = `Arr: ${formatModalDateTime(parseSafeDate_Modal(truck?.arrival_time))}`;
                                    } else {
                                         const truck = outboundTruckMap.get(assign.truck_id);
                                         truckTimeInfo = `Dep: ${formatModalDateTime(parseSafeDate_Modal(truck?.scheduled_departure))}`;
                                    }
                                }
                                return (
                                    <TableRow key={`${assign.truck_id}-${index}`}>
                                        <TableCell className="font-medium">{assign.truck_id ?? '-'}</TableCell>
                                        <TableCell>{assign.task_type}</TableCell>
                                        <TableCell>{formatModalTime(parseSafeDate_Modal(assign.start_time))}</TableCell>
                                        <TableCell>{formatModalTime(parseSafeDate_Modal(assign.end_time))}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{truckTimeInfo}</TableCell>
                                    </TableRow>
                                );
                             }) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">No assignments scheduled for this dock.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                 </div>

                 <DialogFooter className="mt-4">
                      <Button type="button" variant="secondary" onClick={onClose}>
                          Close
                      </Button>
                 </DialogFooter>
             </DialogContent>
         </Dialog>
    );
}
