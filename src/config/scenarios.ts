// src/config/scenarios.ts

export interface ScenarioConfig {
  id: string; // Unique ID for React keys
  label: string; // User-friendly label for dropdown
  prefix: string;
  date: string;
  shift: 'A' | 'B' | 'C';
  // Add notes or expected characteristics if desired
  notes?: string; 
}

export const PREDEFINED_SCENARIOS: ScenarioConfig[] = [
  // Add all 14 scenarios from your log output here
  { id: "1a", label: "Aug 26 - Shift A", prefix: "1_", date: "2024-08-26", shift: "A", notes: "10 In, 3 Out" },
  { id: "1b", label: "Aug 26 - Shift B", prefix: "1_", date: "2024-08-26", shift: "B", notes: "13 In, 3 Out" },
  { id: "1c", label: "Aug 26 - Shift C", prefix: "1_", date: "2024-08-26", shift: "C", notes: "27 In, 5 Out" },
  { id: "2a", label: "Aug 27 - Shift A", prefix: "1_", date: "2024-08-27", shift: "A", notes: "16 In, 3 Out" },
  { id: "2b", label: "Aug 27 - Shift B", prefix: "1_", date: "2024-08-27", shift: "B", notes: "12 In, 4 Out" },
  { id: "2c", label: "Aug 27 - Shift C", prefix: "1_", date: "2024-08-27", shift: "C", notes: "30 In, 6 Out - Busy" },
  { id: "3a", label: "Aug 28 - Shift A", prefix: "1_", date: "2024-08-28", shift: "A", notes: "13 In, 4 Out - High REPL" },
  { id: "3b", label: "Aug 28 - Shift B", prefix: "1_", date: "2024-08-28", shift: "B", notes: "13 In, 3 Out" },
  { id: "3c", label: "Aug 28 - Shift C", prefix: "1_", date: "2024-08-28", shift: "C", notes: "26 In, 4 Out" },
  { id: "4a", label: "Aug 29 - Shift A", prefix: "1_", date: "2024-08-29", shift: "A", notes: "15 In, 3 Out" },
  { id: "4b", label: "Aug 29 - Shift B", prefix: "1_", date: "2024-08-29", shift: "B", notes: "12 In, 3 Out" },
  { id: "4c", label: "Aug 29 - Shift C", prefix: "1_", date: "2024-08-29", shift: "C", notes: "29 In, 4 Out" },
  { id: "5a", label: "Aug 30 - Shift A", prefix: "1_", date: "2024-08-30", shift: "A", notes: "23 In, 3 Out" },
  { id: "5b", label: "Aug 30 - Shift B", prefix: "1_", date: "2024-08-30", shift: "B", notes: "6 In, 4 Out - High REPL" },
];

// Optionally define default scenario ID
export const DEFAULT_SCENARIO_ID = "2c"; // e.g., Aug 27 - Shift C (Busy)
