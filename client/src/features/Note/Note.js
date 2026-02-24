import "./Note.css";

export default function Note({ setEditNote, deleteNote, data }) {
  const { id, value } = data;

  return (
    <div className="noteList">
      <button className="edit" onClick={() => setEditNote({ id, value })}>Редактировать</button>
      <button className="delete" onClick={() => deleteNote(id)}>Удалить</button>
      <p className="text1">{value}</p>
    </div>
  );
}