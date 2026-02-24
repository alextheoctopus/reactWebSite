import React, { useEffect, useState } from "react";
import EditNote from "../features/EditedNote/EditNote";
import NoteList from "../features/NoteList/NoteList";

import { listNotes, createNote, updateNote, deleteNote } from "../api/notes";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [noteData, setNoteData] = useState(null);
  const [openEditNote, setOpenEditNote] = useState(null); // null | "create" | "edit"
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await listNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Не удалось загрузить заметки");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const closeOpenedNote = () => {
    setNoteData(null);
    setOpenEditNote(null);
  };

  const setCreateNote = () => setOpenEditNote("create");

  const setEditNote = (data) => {
    setNoteData(data);
    setOpenEditNote("edit");
  };

  const createNewNote = async ({ value }) => {
    const trimmed = (value ?? "").trim();
    if (!trimmed) return;

    try {
      const created = await createNote(trimmed);
      // оптимистично добавим
      setNotes((prev) => [created, ...prev]);
      closeOpenedNote();
    } catch (e) {
      setErr(e?.message || "Не удалось создать заметку");
    }
  };

  const changeNote = async ({ id, value }) => {
    const trimmed = (value ?? "").trim();
    if (!trimmed) return;

    try {
      const updated = await updateNote(id, trimmed);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      closeOpenedNote();
    } catch (e) {
      setErr(e?.message || "Не удалось обновить заметку");
    }
  };

  const removeNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      setErr(e?.message || "Не удалось удалить заметку");
    }
  };

  return (
    <div className="contentContainer">
      <button className="createBtn" onClick={setCreateNote}>
        Создать заметку
      </button>

      {err ? <div className="authError" style={{ marginBottom: 12 }}>{err}</div> : null}

      {loading ? <div>Загрузка...</div> : null}

      {openEditNote && (
        <EditNote
          changeNote={changeNote}
          createNewNote={createNewNote}
          closeOpenedNote={closeOpenedNote}
          type={openEditNote}
          noteData={noteData}
        />
      )}

      <NoteList notes={notes} setEditNote={setEditNote} deleteNote={removeNote} />
    </div>
  );
}