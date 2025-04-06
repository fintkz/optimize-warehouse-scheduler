// src/hooks/useScheduleData.ts
import { useState, useEffect } from 'react';
// Assuming you have defined your response schema mirroring the Pydantic models
// You might need to generate these or define them manually based on schemas.py
// For now, we'll use 'any' and refine later with proper types.
// import { ScheduleResponse } from '../types'; // Example if you have types defined

// Define the structure matching your Pydantic ScheduleResponse (can be simplified initially)
// It's better to define these properly based on your schemas.py
export interface ScheduleResponse {
  schedule_request: any;
  inbound_schedule: any[];
  outbound_schedule: any[];
  wave_schedule: any[];
  dock_schedule: {
    inbound_docks: any[];
    outbound_docks: any[];
  };
  summary: any;
  shift_start: string | null;
  shift_end: string | null;
}


// const API_URL = 'https://web-production-713b0.up.railway.app/api/v1/schedule'; // Your backend API URL
const API_URL = 'http://localhost:3003/api/v1/schedule'; // Your backend API URL
export function useScheduleData() {
  const [data, setData] = useState<ScheduleResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching schedule data..."); // Log start

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        // Send empty body to use defaults defined in the backend schema
        body: JSON.stringify({}), 
      });

      if (!response.ok) {
        // Attempt to parse error response from backend if possible
        let errorDetail = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorDetail;
        } catch (e) {
            // Ignore if error response is not JSON
        }
        throw new Error(errorDetail);
      }

      const result: ScheduleResponse = await response.json();
      console.log("Schedule data received:", result); // Log success
      setData(result);

    } catch (err) {
      console.error("Error fetching schedule data:", err); // Log error
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setData(null); // Clear data on error
    } finally {
      setIsLoading(false);
      console.log("Fetching finished."); // Log end
    }
  };

  useEffect(() => {
    fetchSchedule(); // Fetch data on initial component mount
  }, []); // Empty dependency array means run only once on mount

  // Return state and a function to refetch if needed
  return { data, isLoading, error, refetch: fetchSchedule };
}
