import { Router } from "express";
import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  updateJournalEntry,
} from "../../controllers/journalController.js";

const router = Router();

router.get("/", getJournalEntries);
router.post("/", createJournalEntry);
router.put("/:id", updateJournalEntry);
router.delete("/:id", deleteJournalEntry);

export { router as journalRouter };
