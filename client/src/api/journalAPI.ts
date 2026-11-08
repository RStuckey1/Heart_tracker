import Auth from "../utils/auth";
import type { JournalEntry, JournalEntryInput } from "../interfaces/JournalEntry";

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Auth.getToken()}`,
      ...init.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data as T;
};

export const getJournalEntries = () =>
  request<JournalEntry[]>("/api/journal/");

export const createJournalEntry = (entry: JournalEntryInput) =>
  request<JournalEntry>("/api/journal/", {
    method: "POST",
    body: JSON.stringify(entry),
  });

export const updateJournalEntry = (id: number, entry: JournalEntryInput) =>
  request<JournalEntry>(`/api/journal/${id}`, {
    method: "PUT",
    body: JSON.stringify(entry),
  });

export const deleteJournalEntry = (id: number) =>
  request<{ message: string }>(`/api/journal/${id}`, {
    method: "DELETE",
  });
