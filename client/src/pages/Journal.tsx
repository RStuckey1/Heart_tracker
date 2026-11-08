import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  updateJournalEntry,
} from "../api/journalAPI";
import type {
  JournalCategory,
  JournalEntry,
  JournalEntryInput,
} from "../interfaces/JournalEntry";
import "../CSS/Journal.css";

const categoryLabels: Record<JournalCategory, string> = {
  workout: "Workout",
  meal: "Meal",
  symptoms: "Symptoms",
  note: "Note",
};

const categories = Object.keys(categoryLabels) as JournalCategory[];

const localDateString = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
};

const formatJournalDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<JournalCategory | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<JournalEntryInput>({
    date: localDateString(),
    category: "note",
    content: "",
  });
  const [editData, setEditData] = useState<JournalEntryInput | null>(null);
  const [saving, setSaving] = useState(false);

  const refreshEntries = async () => {
    setErrorMessage("");
    try {
      setEntries(await getJournalEntries());
    } catch (error) {
      console.error("Could not load journal entries:", error);
      setErrorMessage("Your journal could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshEntries();
  }, []);

  const visibleEntries = useMemo(() => entries
    .filter((entry) => categoryFilter === "all" || entry.category === categoryFilter)
    .filter((entry) => !dateFrom || entry.date >= dateFrom)
    .filter((entry) => !dateTo || entry.date <= dateTo)
    .sort((a, b) => {
      const byDate = a.date.localeCompare(b.date);
      const byCreated = a.createdAt.localeCompare(b.createdAt);
      return sortOrder === "newest" ? byDate * -1 || byCreated * -1 : byDate || byCreated;
    }), [entries, categoryFilter, dateFrom, dateTo, sortOrder]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    try {
      const entry = await createJournalEntry({
        ...formData,
        content: formData.content.trim(),
      });
      setEntries((current) => [entry, ...current]);
      setFormData({ date: localDateString(), category: "note", content: "" });
    } catch (error) {
      console.error("Could not save journal entry:", error);
      setErrorMessage(error instanceof Error ? error.message : "Your entry could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setEditData({
      date: entry.date,
      category: entry.category,
      content: entry.content,
    });
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingId === null || !editData) return;
    setSaving(true);
    setErrorMessage("");
    try {
      const updated = await updateJournalEntry(editingId, {
        ...editData,
        content: editData.content.trim(),
      });
      setEntries((current) => current.map((entry) => entry.id === updated.id ? updated : entry));
      setEditingId(null);
      setEditData(null);
    } catch (error) {
      console.error("Could not update journal entry:", error);
      setErrorMessage(error instanceof Error ? error.message : "Your entry could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this journal entry? This cannot be undone.")) return;
    setErrorMessage("");
    try {
      await deleteJournalEntry(id);
      setEntries((current) => current.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Could not delete journal entry:", error);
      setErrorMessage(error instanceof Error ? error.message : "Your entry could not be deleted.");
    }
  };

  const renderEntryForm = (
    value: JournalEntryInput,
    setValue: (next: JournalEntryInput) => void,
    onSubmit: (event: FormEvent<HTMLFormElement>) => void,
    submitLabel: string,
    onCancel?: () => void,
  ) => (
    <form className="journal-entry-form" onSubmit={onSubmit}>
      <div className="journal-form-row">
        <div className="form-group">
          <label htmlFor={onCancel ? "edit-journal-date" : "journal-date"}>Date</label>
          <input
            className="form-input"
            id={onCancel ? "edit-journal-date" : "journal-date"}
            type="date"
            value={value.date}
            required
            onChange={(event) => setValue({ ...value, date: event.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor={onCancel ? "edit-journal-category" : "journal-category"}>Label</label>
          <select
            className="form-input"
            id={onCancel ? "edit-journal-category" : "journal-category"}
            value={value.category}
            onChange={(event) => setValue({ ...value, category: event.target.value as JournalCategory })}
          >
            {categories.map((category) => (
              <option key={category} value={category}>{categoryLabels[category]}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor={onCancel ? "edit-journal-content" : "journal-content"}>Your note</label>
        <textarea
          className="form-input journal-textarea"
          id={onCancel ? "edit-journal-content" : "journal-content"}
          value={value.content}
          maxLength={5000}
          rows={4}
          placeholder="Write a few details to remember about your day…"
          required
          onChange={(event) => setValue({ ...value, content: event.target.value })}
        />
        <span className="journal-character-count">{value.content.length}/5000</span>
      </div>
      <div className="journal-form-actions">
        {onCancel && (
          <button className="button button-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="button" type="submit" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );

  return (
    <section className="journal-page">
      <div className="journal-heading">
        <div>
          <p className="eyebrow">A personal daily log</p>
          <h1 className="page-title">Health journal</h1>
          <p className="page-description">
            Capture workouts, meals, symptoms, and anything else you want to remember.
          </p>
        </div>
        <Link className="button button-secondary" to="/DisplayRecords">View readings</Link>
      </div>

      <div className="journal-layout">
        <section className="journal-compose card" aria-labelledby="journal-compose-title">
          <h2 id="journal-compose-title">Write an entry</h2>
          <p className="journal-section-description">Your journal is private to your account.</p>
          {renderEntryForm(formData, setFormData, handleCreate, "Save entry")}
        </section>

        <div className="journal-list-column">
          <section className="journal-filters card" aria-label="Filter journal entries">
            <div className="journal-filters-heading">
              <div>
                <h2>Your entries</h2>
                <p>{visibleEntries.length} {visibleEntries.length === 1 ? "entry" : "entries"}</p>
              </div>
              <button
                className="journal-reset"
                type="button"
                onClick={() => {
                  setCategoryFilter("all");
                  setDateFrom("");
                  setDateTo("");
                  setSortOrder("newest");
                }}
              >
                Clear filters
              </button>
            </div>
            <div className="journal-filter-controls">
              <div className="form-group journal-category-filter">
                <label htmlFor="category-filter">Label</label>
                <select
                  className="form-input"
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value as JournalCategory | "all")}
                >
                  <option value="all">All labels</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{categoryLabels[category]}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date-from">From</label>
                <input className="form-input" id="date-from" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="date-to">To</label>
                <input className="form-input" id="date-to" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="sort-order">Order</label>
                <select className="form-input" id="sort-order" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>
          </section>

          {errorMessage && <p className="journal-error" role="alert">{errorMessage}</p>}
          {loading ? (
            <p className="journal-state" role="status">Loading your journal…</p>
          ) : visibleEntries.length === 0 ? (
            <div className="journal-empty card">
              <span className="journal-empty-icon" aria-hidden="true">✎</span>
              <h2>{entries.length ? "No entries match those filters" : "Your journal starts here"}</h2>
              <p>{entries.length ? "Try another label or date range." : "Write your first note to keep track of the details that matter to you."}</p>
            </div>
          ) : (
            <div className="journal-entries">
              {visibleEntries.map((entry, index) => {
                const previousEntry = visibleEntries[index - 1];
                const showDateHeading = !previousEntry || previousEntry.date !== entry.date;
                const isEditing = editingId === entry.id;
                return (
                  <div className="journal-date-group" key={entry.id}>
                    {showDateHeading && <h2 className="journal-date-heading">{formatJournalDate(entry.date)}</h2>}
                    <article className={`journal-entry card category-${entry.category}`}>
                      {isEditing && editData ? (
                        renderEntryForm(
                          editData,
                          setEditData,
                          handleUpdate,
                          "Save changes",
                          () => {
                            setEditingId(null);
                            setEditData(null);
                          },
                        )
                      ) : (
                        <>
                          <div className="journal-entry-topline">
                            <span className={`journal-category-badge badge-${entry.category}`}>{categoryLabels[entry.category]}</span>
                            <div className="journal-entry-actions">
                              <button className="journal-action" type="button" onClick={() => startEditing(entry)}>Edit</button>
                              <button className="journal-action journal-action-delete" type="button" onClick={() => void handleDelete(entry.id)}>Delete</button>
                            </div>
                          </div>
                          <p className="journal-entry-content">{entry.content}</p>
                          <time className="journal-entry-date" dateTime={entry.date}>{formatJournalDate(entry.date)}</time>
                        </>
                      )}
                    </article>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Journal;
