// src/components/dashboard/ScheduleControlForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SlidersHorizontal } from 'lucide-react';

// Import scenario config
import { PREDEFINED_SCENARIOS, DEFAULT_SCENARIO_ID, ScenarioConfig } from '@/config/scenarios'; // Adjust path if needed

// Define the type for the parameters passed up to the parent
export interface ScheduleParams {
    prefix: string;
    date: string;
    shift: 'A' | 'B' | 'C';
    docks_inbound: number;
    docks_outbound: number;
    max_workers_per_wave: number;
    // Workers list is handled by API default for now
}

interface ScheduleControlFormProps {
    onGeneratePlan: (params: ScheduleParams) => void; // Callback function
    isGenerating: boolean; // To disable button while loading
}

export function ScheduleControlForm({ onGeneratePlan, isGenerating }: ScheduleControlFormProps) {
    // Find the default scenario object
    const defaultScenario = PREDEFINED_SCENARIOS.find(s => s.id === DEFAULT_SCENARIO_ID) || PREDEFINED_SCENARIOS[0];

    // --- State Management ---
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>(defaultScenario.id);
    // Individual states for overrides or direct input
    const [currentPrefix, setCurrentPrefix] = useState<string>(defaultScenario.prefix);
    const [currentDate, setCurrentDate] = useState<string>(defaultScenario.date);
    const [currentShift, setCurrentShift] = useState<'A' | 'B' | 'C'>(defaultScenario.shift);
    // Resource states with defaults matching backend/schemas
    const [docksInbound, setDocksInbound] = useState<number>(10);
    const [docksOutbound, setDocksOutbound] = useState<number>(10);
    const [maxWorkers, setMaxWorkers] = useState<number>(15);

    // Effect to update individual states when a scenario preset is selected
    useEffect(() => {
        const scenario = PREDEFINED_SCENARIOS.find(s => s.id === selectedScenarioId);
        if (scenario) {
            setCurrentPrefix(scenario.prefix);
            setCurrentDate(scenario.date);
            setCurrentShift(scenario.shift);
            // Optionally reset docks/workers to scenario defaults here too if needed
            // setDocksInbound(10); // Reset to default when scenario changes? Or keep user override?
            // setDocksOutbound(10);
            // setMaxWorkers(15);
        }
    }, [selectedScenarioId]);

    const handleGenerateClick = () => {
        const params: ScheduleParams = {
            prefix: currentPrefix,
            date: currentDate,
            shift: currentShift,
            docks_inbound: docksInbound,
            docks_outbound: docksOutbound,
            max_workers_per_wave: maxWorkers,
        };
        console.log("Generating plan with params:", params);
        onGeneratePlan(params);
    };

    // Helper to handle number input changes
    const handleNumberInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
         const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
         setter(isNaN(value) ? 0 : Math.max(0, value)); // Ensure non-negative integer
    };

    return (
        <Card className="mb-6 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg flex items-center">
                     <SlidersHorizontal className="h-5 w-5 mr-2" /> Plan Configuration
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Scenario Selector */}
                <div className="space-y-1">
                     <Label htmlFor="scenario-select">Select Scenario Preset</Label>
                     <Select 
                        value={selectedScenarioId} 
                        onValueChange={(value) => setSelectedScenarioId(value)}
                     >
                         <SelectTrigger id="scenario-select">
                             <SelectValue placeholder="Select a scenario..." />
                         </SelectTrigger>
                         <SelectContent>
                             {PREDEFINED_SCENARIOS.map(scenario => (
                                 <SelectItem key={scenario.id} value={scenario.id}>
                                     {scenario.label} <span className="text-xs text-muted-foreground ml-2">({scenario.notes})</span>
                                </SelectItem>
                             ))}
                         </SelectContent>
                     </Select>
                 </div>

                {/* Display/Override Date & Shift */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1">
                         <Label htmlFor="date-display">Date</Label>
                         {/* TODO: Replace with actual Date Picker later, for now display/confirm */}
                         <Input id="date-display" value={currentDate} disabled /> 
                     </div>
                     <div className="space-y-1">
                          <Label htmlFor="shift-select">Shift</Label>
                          <Select 
                             value={currentShift} 
                             onValueChange={(value: 'A'|'B'|'C') => setCurrentShift(value)}
                          >
                             <SelectTrigger id="shift-select">
                                 <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="A">Shift A (07:00-15:00)</SelectItem>
                                 <SelectItem value="B">Shift B (15:00-23:00)</SelectItem>
                                 <SelectItem value="C">Shift C (23:00-07:00)</SelectItem>
                             </SelectContent>
                          </Select>
                     </div>
                 </div>

                {/* Resource Configuration */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="space-y-1">
                         <Label htmlFor="docks-in">Inbound Docks</Label>
                         <Input 
                            id="docks-in" 
                            type="number" 
                            min="1" 
                            value={docksInbound} 
                            onChange={handleNumberInputChange(setDocksInbound)}
                        />
                     </div>
                     <div className="space-y-1">
                         <Label htmlFor="docks-out">Outbound Docks</Label>
                         <Input 
                             id="docks-out" 
                             type="number" 
                             min="1" 
                             value={docksOutbound} 
                             onChange={handleNumberInputChange(setDocksOutbound)}
                        />
                     </div>
                      <div className="space-y-1">
                         <Label htmlFor="max-workers">Max Workers / Wave</Label>
                         <Input 
                             id="max-workers" 
                             type="number" 
                             min="1" 
                             value={maxWorkers} 
                             onChange={handleNumberInputChange(setMaxWorkers)}
                        />
                     </div>
                 </div>

                 {/* Generate Button */}
                 <div className="flex justify-end pt-2">
                      <Button onClick={handleGenerateClick} disabled={isGenerating}>
                          {isGenerating ? 'Generating...' : 'Generate Plan'}
                      </Button>
                 </div>
            </CardContent>
        </Card>
    );
}
