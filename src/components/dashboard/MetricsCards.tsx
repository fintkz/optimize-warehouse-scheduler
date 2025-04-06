// src/components/dashboard/MetricsCards.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Adjust import path
import { 
    Truck, Users, Timer, AlertTriangle, Percent, CheckCircle, ArrowDownSquare, Box, Package 
} from 'lucide-react'; // Import relevant icons

// Define expected structure for summary prop (can be more flexible)
interface SummaryData {
    total_inbound_trucks_scheduled?: number | null;
    total_outbound_trucks_scheduled?: number | null;
    avg_inbound_wait_time_mins?: number | string | null; 
    total_outbound_departure_delay_mins?: number | string | null;
    avg_inbound_dock_utilization_percent?: number | string | null;
    avg_outbound_dock_utilization_percent?: number | string | null;
    avg_worker_utilization_percent?: number | string | null;
    // Add num_workers_available if you calculate it in the backend summary
    // num_workers_available?: number | null; 
    [key: string]: any; // Allow other potential keys
}

interface MetricsCardsProps {
    summary: SummaryData | null;
    workerCount?: number | null; // Still useful to pass explicitly if available sooner
}

// --- Mapping from summary keys to display properties ---
interface MetricDisplayConfig {
    label: string; // Title for the card
    valuePrefix?: string;
    valueSuffix?: string;
    decimals?: number;
    description?: string; // Subtext on the card
    icon: React.ElementType; // Icon component
    bgColorClass?: string; // Optional background color class
    textColorClass?: string; // Optional text color class for value
}

const METRIC_CONFIG: Record<keyof SummaryData | string, MetricDisplayConfig> = {
    total_inbound_trucks_scheduled: { 
        label: "Inbound Trucks", 
        icon: ArrowDownSquare, 
        description: "Scheduled Deliveries" 
    },
    total_outbound_trucks_scheduled: { 
        label: "Outbound Trucks", 
        icon: Truck, // Use standard truck or flipped one
        description: "Scheduled Shipments" 
    },
    // Placeholder for Orders - Data not currently in summary
    // total_orders: { 
    //     label: "Orders", 
    //     icon: Package, 
    //     description: "Total Orders in Plan" 
    // },
    num_workers_available: { // Use workerCount prop instead if passed
         label: "Labor Pool", 
         icon: Users, 
         description: "Workers Available" 
    },
    avg_inbound_wait_time_mins: { 
        label: "Avg Inbound Wait", 
        icon: Timer, 
        valueSuffix: " min", 
        decimals: 1,
        description: "Avg wait before processing" 
    },
    total_outbound_departure_delay_mins: { 
        label: "Total Outbound Delay", 
        icon: AlertTriangle, // Use warning icon for delay
        valueSuffix: " min", 
        decimals: 1,
        description: "Sum of delays past departure",
        bgColorClass: "bg-amber-50 dark:bg-amber-900/30", // Example conditional style
        textColorClass: "text-amber-700 dark:text-amber-400"
    },
    avg_worker_utilization_percent: { 
        label: "Avg Worker Util.", 
        icon: Percent, 
        valueSuffix: "%", 
        decimals: 1, 
        description: "Planned worker utilization" 
    },
     avg_inbound_dock_utilization_percent: { 
        label: "Avg Inbound Dock Util.", 
        icon: Percent, 
        valueSuffix: "%", 
        decimals: 1, 
        description: "Planned inbound dock usage" 
    },
     avg_outbound_dock_utilization_percent: { 
        label: "Avg Outbound Dock Util.", 
        icon: Percent, 
        valueSuffix: "%", 
        decimals: 1, 
        description: "Planned outbound dock usage" 
    },
    // Add more mappings here if other summary keys become available
};

// Helper to format numbers or show placeholder/NA (as before)
const formatMetric = (value: number | string | null | undefined, decimals: number = 0, suffix: string = ''): string => {
    if (typeof value === 'number') {
        if (isNaN(value)) return 'N/A'; 
        return value.toFixed(decimals) + suffix;
    }
    // Allow specific strings like "Not Implemented" etc.
    if (typeof value === 'string' && value.length > 0) return value; 
    return 'N/A'; 
};


export default function MetricsCards({ summary, workerCount }: MetricsCardsProps) {
    const summaryData = summary || {}; 
    
    // Determine worker count to display
    const displayWorkerCount = workerCount ?? summaryData.num_workers_available ?? null; 

    // --- Create Metric Items Dynamically ---
    const metricItems = Object.entries(summaryData)
        // Optionally filter which keys to display as cards
        .filter(([key]) => key in METRIC_CONFIG || (key === 'num_workers_available' && workerCount === null)) 
        .map(([key, value]) => {
            // Special handling for worker count to use prop if available
            if (key === 'num_workers_available' && workerCount !== null) {
                 value = workerCount; // Override value from summary with prop
            } else if (key === 'num_workers_available' && workerCount === null) {
                 // If prop not passed, use value from summary (already assigned)
                 // but make sure we use the right config key later
                 key = 'num_workers_available'; 
            }

            // Get display config, default to a basic one if key somehow missed
            const config: MetricDisplayConfig = METRIC_CONFIG[key] || { // Add type assertion
              label: key.replace(/_/g, ' ').replace(/ percent$/, '%').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 
              icon: CheckCircle, 
              decimals: key.includes('percent') ? 1 : 0,
              valueSuffix: key.includes('percent') ? '%' : (key.includes('mins') ? ' min' : ''),
              // --- FIX: Add missing optional properties ---
              description: undefined, // or ''
              bgColorClass: undefined, // or ''
              textColorClass: undefined // or ''
              // -----------------------------------------
          };
            
            const IconComponent = config.icon;

            return {
                key: key,
                label: config.label,
                value: formatMetric(value, config.decimals, config.valueSuffix),
                description: config.description || '',
                icon: <IconComponent className="h-4 w-4 text-muted-foreground" />,
                bgColorClass: config.bgColorClass || '',
                textColorClass: config.textColorClass || '',
            };
        })
        // Ensure consistent order maybe? Or filter specific keys out?
        // Example order: Define an array of keys in the desired order and sort `metricItems` by it.
        const displayOrder = [
             'total_inbound_trucks_scheduled', 'total_outbound_trucks_scheduled', 
             // 'total_orders', // If/when added
             'num_workers_available', 'avg_inbound_wait_time_mins', 
             'total_outbound_departure_delay_mins', 'avg_worker_utilization_percent',
             'avg_inbound_dock_utilization_percent', 'avg_outbound_dock_utilization_percent'
        ];
        metricItems.sort((a, b) => {
             const indexA = displayOrder.indexOf(a.key);
             const indexB = displayOrder.indexOf(b.key);
             // Put known keys first in order, unknown keys last
             if (indexA === -1 && indexB === -1) return 0;
             if (indexA === -1) return 1;
             if (indexB === -1) return -1;
             return indexA - indexB;
        });


    return (
        // Adjust grid columns based on the number of metrics if needed, or keep fixed
        <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-${Math.min(metricItems.length, 6)} xl:grid-cols-${Math.min(metricItems.length, 6)}`}>
            {metricItems.map((metric) => (
                <Card key={metric.key} className={metric.bgColorClass}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                        {metric.icon}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${metric.textColorClass}`}>
                            {metric.value}
                        </div>
                        {metric.description && (
                            <p className="text-xs text-muted-foreground">
                                {metric.description}
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
            {/* Placeholder for Order card if data isn't in summary */}
             {/* {!summaryData.hasOwnProperty('total_orders') && (
                 <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium">Orders</CardTitle>
                         <Package className="h-4 w-4 text-muted-foreground" /> 
                     </CardHeader>
                     <CardContent>
                         <div className="text-2xl font-bold text-muted-foreground">---</div> 
                         <p className="text-xs text-muted-foreground">Total Orders in Plan</p>
                         <p className="text-xs text-muted-foreground mt-1">Requires data source</p>
                     </CardContent>
                 </Card>
             )} */}
        </div>
    );
}