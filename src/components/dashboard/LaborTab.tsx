// src/components/dashboard/LaborTab.tsx
import React from 'react';

interface LaborTabProps {
    workers: string[]; // Assuming list of worker IDs
    summary: any; // Summary object containing utilization etc.
}

export function LaborTab({ workers, summary }: LaborTabProps) {
    const workerUtil = summary?.avg_worker_utilization_percent;
    const numWorkers = workers?.length || 0;

    return (
        <div className="space-y-4">
             <div className="p-4 border rounded-md bg-card">
                <h3 className="text-lg font-semibold mb-2">Worker Overview</h3>
                <p>Total Workers Available: {numWorkers}</p>
                 <p>Average Utilization: {typeof workerUtil === 'number' ? `${workerUtil}%` : (workerUtil || 'N/A')}</p>
                 {/* Add more detailed breakdown later */}
             </div>
             <div className="p-4 border rounded-md bg-card">
                 <h3 className="text-lg font-semibold mb-2">Worker List (Sample)</h3>
                 <ul className="list-disc list-inside text-sm max-h-60 overflow-y-auto">
                     {(workers || []).slice(0, 20).map((workerId, index) => ( // Show first 20
                         <li key={index}>{workerId}</li>
                     ))}
                     {workers.length > 20 && <li>... and {workers.length - 20} more</li>}
                 </ul>
             </div>
        </div>
    );
}
