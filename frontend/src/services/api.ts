import axios from "axios";
import type { ApiResponse, Entry, EntryFormData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined in your .env.local file.");
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getEntries = async (
  page: number,
  limit: number,
  filters?: {
    search?: string;
    type?: string;
    director?: string;
    releaseYear?: number;
  }
): Promise<ApiResponse<Entry>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.type) {
      params.append('type', filters.type);
    }
    if (filters?.director) {
      params.append('director', filters.director);
    }
    if (filters?.releaseYear) {
      params.append('releaseYear', filters.releaseYear.toString());
    }
    
    const response = await apiClient.get<ApiResponse<Entry>>(
      `/entries?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
};

export const createEntry = async (data: EntryFormData): Promise<Entry> => {
  try {
    // Ensure releaseYear is converted to number before sending
    const payload = {
      ...data,
      releaseYear: Number(data.releaseYear),
    };
    const response = await apiClient.post<Entry>("/entries", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating entry:", error);
    throw error;
  }
};

export const updateEntry = async (
  id: number,
  data: Partial<EntryFormData>
): Promise<Entry> => {
  try {
    // Ensure releaseYear is converted to number if it's present for update
    const payload: any = {
      ...data,
    };
    if (data.releaseYear !== undefined && data.releaseYear !== "") {
      payload.releaseYear = Number(data.releaseYear);
    } else if (data.releaseYear === "") {
      // If it's explicitly set to empty, remove it or handle as null if backend supports
      delete payload.releaseYear;
    }

    const response = await apiClient.put<Entry>(`/entries/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating entry with ID ${id}:`, error);
    throw error;
  }
};

export const deleteEntry = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/entries/${id}`);
  } catch (error) {
    console.error(`Error deleting entry with ID ${id}:`, error);
    throw error;
  }
};

export const signup = async (email: string, password: string) => {
  try {
    const response = await apiClient.post<{ id: number; email: string }>(
      "/auth/signup",
      { email, password }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post<{
      token: string;
      user: { id: number; email: string };
    }>("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
