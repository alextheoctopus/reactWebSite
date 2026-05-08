import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Note from "./Note";

test("Note renders value and buttons call handlers", () => {
  const setEditNote = jest.fn();
  const deleteNote = jest.fn();

  render(
    <Note
      data={{ id: 7, value: "Hello" }}
      setEditNote={setEditNote}
      deleteNote={deleteNote}
    />
  );

  expect(screen.getByText("Hello")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Редактировать"));
  expect(setEditNote).toHaveBeenCalledWith({ id: 7, value: "Hello" });

  fireEvent.click(screen.getByText("Удалить"));
  expect(deleteNote).toHaveBeenCalledWith(7);
});
