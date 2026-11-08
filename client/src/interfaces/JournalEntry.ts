export type JournalCategory = "workout" | "meal" | "symptoms" | "note";

export interface JournalEntry {
  id: number;
  date: string;
  category: JournalCategory;
  content: string;
  UserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryInput {
  date: string;
  category: JournalCategory;
  content: string;
}
