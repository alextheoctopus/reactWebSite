import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import NotesPage from "./NotesPage";
import * as NotesApi from "../api/notes";

jest.mock("../api/notes");

jest.mock("../features/EditedNote/EditNote", () => (props) => {
  const React = require("react");
  const [value, setValue] = React.useState(props.noteData?.value || "");

  return (
    <div data-testid="edit-note-modal">
      <div>{props.type}</div>
      <input
        aria-label="note-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={() => props.type === "edit" ? props.changeNote({ id: props.noteData.id, value }) : props.createNewNote({ value })}>
        submit-note
      </button>
      <button onClick={props.closeOpenedNote}>close-note</button>
    </div>
  );
});

jest.mock("../features/NoteList/NoteList", () => ({ notes, setEditNote, deleteNote }) => (
  <div>
    {notes.map((note) => (
      <div key={note.id} data-testid={`note-${note.id}`}>
        <span>{note.value}</span>
        <button onClick={() => setEditNote(note)}>edit-{note.id}</button>
        <button onClick={() => deleteNote(note.id)}>delete-{note.id}</button>
      </div>
    ))}
  </div>
));

describe("NotesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads notes and renders list", async () => {
    NotesApi.listNotes.mockResolvedValue([{ id: 1, value: "First note" }]);

    render(<NotesPage />);

    expect(screen.getByText("Загрузка...")) .toBeInTheDocument();
    expect(await screen.findByText("First note")).toBeInTheDocument();
    expect(NotesApi.listNotes).toHaveBeenCalledTimes(1);
  });

  test("shows load error", async () => {
    NotesApi.listNotes.mockRejectedValue(new Error("boom"));

    render(<NotesPage />);

    expect(await screen.findByText("boom")).toBeInTheDocument();
  });

  test("opens create dialog and creates note", async () => {
    NotesApi.listNotes.mockResolvedValue([]);
    NotesApi.createNote.mockResolvedValue({ id: 2, value: "Created note" });

    render(<NotesPage />);

    await waitFor(() => expect(NotesApi.listNotes).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: /создать заметку/i }));
    fireEvent.change(screen.getByLabelText("note-input"), { target: { value: "Created note" } });
    fireEvent.click(screen.getByText("submit-note"));

    await waitFor(() => expect(NotesApi.createNote).toHaveBeenCalledWith("Created note"));
    expect(await screen.findByText("Created note")).toBeInTheDocument();
  });

  test("does not create note from empty value", async () => {
    NotesApi.listNotes.mockResolvedValue([]);

    render(<NotesPage />);

    await waitFor(() => expect(NotesApi.listNotes).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: /создать заметку/i }));
    fireEvent.change(screen.getByLabelText("note-input"), { target: { value: "   " } });
    fireEvent.click(screen.getByText("submit-note"));

    expect(NotesApi.createNote).not.toHaveBeenCalled();
  });

  test("edits existing note", async () => {
    NotesApi.listNotes.mockResolvedValue([{ id: 3, value: "Old note" }]);
    NotesApi.updateNote.mockResolvedValue({ id: 3, value: "Updated note" });

    render(<NotesPage />);

    expect(await screen.findByText("Old note")).toBeInTheDocument();

    fireEvent.click(screen.getByText("edit-3"));
    fireEvent.change(screen.getByLabelText("note-input"), { target: { value: "Updated note" } });
    fireEvent.click(screen.getByText("submit-note"));

    await waitFor(() => expect(NotesApi.updateNote).toHaveBeenCalledWith(3, "Updated note"));
    expect(await screen.findByText("Updated note")).toBeInTheDocument();
  });

  test("removes note", async () => {
    NotesApi.listNotes.mockResolvedValue([{ id: 4, value: "Delete me" }]);
    NotesApi.deleteNote.mockResolvedValue(null);

    render(<NotesPage />);

    expect(await screen.findByText("Delete me")).toBeInTheDocument();

    fireEvent.click(screen.getByText("delete-4"));

    await waitFor(() => expect(NotesApi.deleteNote).toHaveBeenCalledWith(4));
    await waitFor(() => expect(screen.queryByText("Delete me")).not.toBeInTheDocument());
  });

  test("shows delete error", async () => {
    NotesApi.listNotes.mockResolvedValue([{ id: 5, value: "Keep me" }]);
    NotesApi.deleteNote.mockRejectedValue(new Error("Delete failed"));

    render(<NotesPage />);

    expect(await screen.findByText("Keep me")).toBeInTheDocument();
    fireEvent.click(screen.getByText("delete-5"));

    expect(await screen.findByText("Delete failed")).toBeInTheDocument();
    expect(screen.getByText("Keep me")).toBeInTheDocument();
  });
});
