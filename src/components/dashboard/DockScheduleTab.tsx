// src/components/dashboard/DockScheduleTab.tsx
import React from 'react';

interface DockScheduleTabProps {
    dockData: {
        inbound_docks: any[];
        outbound_docks: any[];
    };
}

export function DockScheduleTab({ dockData }: DockScheduleTabProps) {
    // Filter logic will go here later
    const usedInboundDocks = dockData.inbound_docks?.filter(dock => dock.assignments?.length > 0) || [];
    const usedOutboundDocks = dockData.outbound_docks?.filter(dock => dock.assignments?.length > 0) || [];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Inbound Docks ({usedInboundDocks.length} Used)</h3>
            {usedInboundDocks.length > 0 ? (
                usedInboundDocks.map(dock => (
                    <div key={dock.dock_id} className="p-3 border rounded-md bg-card">
                       <p className="font-medium">{dock.dock_id}</p> 
                       <pre className="text-xs mt-1 bg-muted p-2 rounded overflow-x-auto">
                           {JSON.stringify(dock.assignments, null, 2)}
                       </pre>
                       {/* Replace pre with actual rendering later */}
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground text-sm">No inbound docks scheduled.</p>
            )}

            <h3 className="text-lg font-semibold mt-4">Outbound Docks ({usedOutboundDocks.length} Used)</h3>
             {usedOutboundDocks.length > 0 ? (
                usedOutboundDocks.map(dock => (
                     <div key={dock.dock_id} className="p-3 border rounded-md bg-card">
                         <p className="font-medium">{dock.dock_id}</p>
                         <pre className="text-xs mt-1 bg-muted p-2 rounded overflow-x-auto">
                             {JSON.stringify(dock.assignments, null, 2)}
                         </pre>
                          {/* Replace pre with actual rendering later */}
                     </div>
                 ))
             ) : (
                 <p className="text-muted-foreground text-sm">No outbound docks scheduled.</p>
             )}
        </div>
    );
}
