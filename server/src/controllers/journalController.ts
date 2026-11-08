import type { Request, Response } from "express";
import { JournalEntry, type JournalCategory } from "../models/journalEntry.js";

const categories: JournalCategory[] = ["workout", "meal", "symptoms", "note"];

const isValidDate = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) &&
  new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;

const isValidEntry = (date: unknown, category: unknown, content: unknown) =>
  isValidDate(date) &&
  typeof category === "string" &&
  categories.includes(category as JournalCategory) &&
  typeof content === "string" &&
  content.trim().length > 0 &&
  content.trim().length <= 5000;

const parseEntryId = (id: string): number | null => {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const getJournalEntries = async (req: Request, res: Response) => {
  const UserId = req.User?.id;
  if (!UserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const entries = await JournalEntry.findAll({
      where: { UserId },
      order: [["date", "DESC"], ["createdAt", "DESC"]],
    });
    res.json(entries);
  } catch (error) {
    console.error("Error retrieving journal entries:", error);
    res.status(500).json({ message: "Could not retrieve journal entries" });
  }
};

export const createJournalEntry = async (req: Request, res: Response) => {
  const UserId = req.User?.id;
  const { date, category, content } = req.body ?? {};

  if (!UserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!isValidEntry(date, category, content)) {
    res.status(400).json({ message: "Provide a valid date, category, and note (up to 5000 characters)." });
    return;
  }

  try {
    const entry = await JournalEntry.create({
      date,
      category,
      content: content.trim(),
      UserId,
    });
    res.status(201).json(entry);
  } catch (error) {
    console.error("Error creating journal entry:", error);
    res.status(500).json({ message: "Could not save journal entry" });
  }
};

export const updateJournalEntry = async (req: Request, res: Response) => {
  const UserId = req.User?.id;
  const id = parseEntryId(req.params.id);
  const { date, category, content } = req.body ?? {};

  if (!UserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!id) {
    res.status(400).json({ message: "Invalid journal entry ID" });
    return;
  }
  if (!isValidEntry(date, category, content)) {
    res.status(400).json({ message: "Provide a valid date, category, and note (up to 5000 characters)." });
    return;
  }

  try {
    const [updatedCount] = await JournalEntry.update(
      { date, category, content: content.trim() },
      { where: { id, UserId } },
    );
    if (!updatedCount) {
      res.status(404).json({ message: "Journal entry not found" });
      return;
    }

    const entry = await JournalEntry.findOne({ where: { id, UserId } });
    res.json(entry);
  } catch (error) {
    console.error("Error updating journal entry:", error);
    res.status(500).json({ message: "Could not update journal entry" });
  }
};

export const deleteJournalEntry = async (req: Request, res: Response) => {
  const UserId = req.User?.id;
  const id = parseEntryId(req.params.id);

  if (!UserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!id) {
    res.status(400).json({ message: "Invalid journal entry ID" });
    return;
  }

  try {
    const deletedCount = await JournalEntry.destroy({ where: { id, UserId } });
    if (!deletedCount) {
      res.status(404).json({ message: "Journal entry not found" });
      return;
    }
    res.json({ message: "Journal entry deleted" });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    res.status(500).json({ message: "Could not delete journal entry" });
  }
};
