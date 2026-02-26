import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BoardPage from "./BoardPage";
import * as BoardApi from "../api/board";

jest.mock("../api/board");

describe("BoardPage", () => {
  beforeEach(() => {
    BoardApi.listBoardItems.mockReset();
    BoardApi.createBoardItem.mockReset();
    BoardApi.updateBoardItem.mockReset();
    BoardApi.deleteBoardItem.mockReset();
  });

  test("loads and shows board items", async () => {
    BoardApi.listBoardItems.mockResolvedValue([
      {
        id: 11,
        text: "Initial text",
        authorName: "Timur",
        lastEditorName: "Timur",
        updatedAt: "2026-02-25T18:00:00",
      },
    ]);

    render(<BoardPage />);

    await screen.findByText("Initial text");

    expect(screen.getByText(/Author:/i)).toBeInTheDocument();
    expect(screen.getByText(/Last editor:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Timur/i)).toHaveLength(2);
    expect(BoardApi.listBoardItems).toHaveBeenCalledTimes(1);
  });

  test("creates board item", async () => {
    BoardApi.listBoardItems.mockResolvedValue([]);
    BoardApi.createBoardItem.mockResolvedValue({
      id: 12,
      text: "New text",
      authorName: "Timur",
      lastEditorName: "Timur",
      updatedAt: "2026-02-25T19:00:00",
    });

    render(<BoardPage />);

    await screen.findByText(/No items yet/i);

    fireEvent.change(screen.getByLabelText(/New item text/i), { target: { value: "New text" } });
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(BoardApi.createBoardItem).toHaveBeenCalledWith("New text");
    });

    expect(await screen.findByText("New text")).toBeInTheDocument();
  });

  test("updates board item", async () => {
    BoardApi.listBoardItems.mockResolvedValue([
      {
        id: 13,
        text: "Old text",
        authorName: "Timur",
        lastEditorName: "Timur",
        updatedAt: "2026-02-25T18:00:00",
      },
    ]);

    BoardApi.updateBoardItem.mockResolvedValue({
      id: 13,
      text: "Changed text",
      authorName: "Timur",
      lastEditorName: "Alex",
      updatedAt: "2026-02-25T19:00:00",
    });

    render(<BoardPage />);

    await screen.findByText("Old text");

    fireEvent.click(screen.getByRole("button", { name: /^Edit$/i }));
    fireEvent.change(screen.getByLabelText(/Edit item 13 text/i), { target: { value: "Changed text" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(BoardApi.updateBoardItem).toHaveBeenCalledWith(13, "Changed text");
    });

    expect(await screen.findByText("Changed text")).toBeInTheDocument();
    expect(await screen.findByText(/Alex/i)).toBeInTheDocument();
  });

  test("deletes board item", async () => {
    BoardApi.listBoardItems.mockResolvedValue([
      {
        id: 14,
        text: "Delete me",
        authorName: "Timur",
        lastEditorName: "Timur",
        updatedAt: "2026-02-25T18:00:00",
      },
    ]);
    BoardApi.deleteBoardItem.mockResolvedValue({});

    render(<BoardPage />);

    await screen.findByText("Delete me");

    fireEvent.click(screen.getByRole("button", { name: /^Delete$/i }));

    await waitFor(() => {
      expect(BoardApi.deleteBoardItem).toHaveBeenCalledWith(14);
    });

    await waitFor(() => {
      expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
    });
  });
});
