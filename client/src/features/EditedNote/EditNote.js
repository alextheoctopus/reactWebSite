import React, { useEffect, useState } from "react";
import "./EditNote.css";

export default function EditNote({ changeNote, createNewNote, type, closeOpenedNote, noteData }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(type === "edit" ? (noteData?.value ?? "") : "");
  }, [type, noteData]);

  const save = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (type === "edit") changeNote({ id: noteData.id, value: trimmed });
    else createNewNote({ value: trimmed });
    closeOpenedNote();
  };

  return (
    <div className="editNote">
      {type === "edit" ? <p>Редактировать</p> : <p>Создать новую заметку</p>}
      <input className="input" value={value} onChange={(e) => setValue(e.target.value)} />
      <button className="saveChanges" onClick={save}>
        Сохранить
      </button>
      <button className="close" onClick={closeOpenedNote}>
        x
      </button>
    </div>
  );
}