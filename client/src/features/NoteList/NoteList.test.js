import React from "react";
import { render, screen } from "@testing-library/react";
import NoteList from "./NoteList";

jest.mock("../Note/Note", () => ({ data }) => <div data-testid="note-item">{data.value}</div>);

test("NoteList renders all notes", () => {
  render(
    <NoteList
      notes={[{ id: 1, value: "A" }, { id: 2, value: "B" }]}
      setEditNote={jest.fn()}
      deleteNote={jest.fn()}
    />
  );

  expect(screen.getAllByTestId("note-item")).toHaveLength(2);
  expect(screen.getByText("A")).toBeInTheDocument();
  expect(screen.getByText("B")).toBeInTheDocument();
});
