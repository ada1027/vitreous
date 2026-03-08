/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';

// Define the shape of a single service/connection
export interface Service {
  id: string;
  name: string;      // The raw name
  display_name: string; // The display name
  category: string;
  is_ghost: boolean;
  is_breached: boolean;
  priority_action: string;
  risk_level: string; // 'HIGH', 'MEDIUM', 'LOW', etc.
  data_shared: string[];
  first_seen: string;
  last_seen: string;
  breaches: { Title: string; BreachDate: string; DataClasses?: string[]; Description?: string; }[];
  days_since_contact: number;
}

// Define the shape of the summary
export interface ScanSummary {
  total_services: number;
  breached_count: number;
  total_breaches: number;
  auth_methods: Record<string, number>;
}

// Define the shape of the full scan response
export interface ScanData {
  insight?: string;
  summary: ScanSummary;
  services: Service[];
}

interface ScanContextType {
  scanData: ScanData | null;
  setScanData: (data: ScanData | null) => void;
  googleToken: string | null;
  setGoogleToken: (token: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ScanContext.Provider value={{ scanData, setScanData, googleToken, setGoogleToken, loading, setLoading }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
}
