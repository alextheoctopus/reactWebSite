import Note from "../Note/Note";

export default function NoteList({ notes, setEditNote, deleteNote }) {
  return (
    <div>
      {notes.map((item) => (
        <Note key={item.id} data={item} setEditNote={setEditNote} deleteNote={deleteNote} />
      ))}
    </div>
  );
}