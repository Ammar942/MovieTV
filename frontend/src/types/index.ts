// frontend/src/types/index.ts

export type EntryType = "Movie" | "TV Show";

export interface Entry {
  id: number;
  title: string;
  type: EntryType;
  director: string;
  budget?: string;
  location?: string;
  duration?: string;
  releaseYear: number;
  endTime?: string;
  notes?: string;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
}

// Data shape for the form, including potentially empty strings for optional fields
// and a special type for releaseYear before conversion to number
export interface EntryFormData {
  title: string;
  type: EntryType | ""; // Allow empty for initial form state if it's a select
  director: string;
  budget: string;
  location: string;
  duration: string;
  releaseYear: number | ""; // Allow empty for initial form state
  endTime: string;
  notes: string;
}

export interface ApiResponse<T> {
  entries: T[];
  total: number;
  page: number;
  limit: number;
}
