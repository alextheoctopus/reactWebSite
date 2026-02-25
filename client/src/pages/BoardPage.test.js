import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BoardPage from "./BoardPage";
import * as BoardApi from "../api/board";

jest.mock("../api/board");

describe("BoardPage", () => {
  beforeEach(() => {
    BoardApi.getBoard.mockReset();
    BoardApi.updateBoard.mockReset();
  });

  test("loads and shows board", async () => {
    BoardApi.getBoard.mockResolvedValue({
      text: "Initial text",
      authorName: "Timur",
      updatedAt: "2026-02-25T18:00:00",
    });

    render(<BoardPage />);

    await waitFor(() => expect(BoardApi.getBoard).toHaveBeenCalled());

    expect(screen.getByText(/Last author:/i)).toBeInTheDocument();
    expect(screen.getByText(/Timur/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Initial text")).toBeInTheDocument();
  });

  test("updates board text", async () => {
    BoardApi.getBoard.mockResolvedValue({
      text: "Initial text",
      authorName: "Timur",
      updatedAt: "2026-02-25T18:00:00",
    });

    BoardApi.updateBoard.mockResolvedValue({
      text: "Changed text",
      authorName: "Timur",
      updatedAt: "2026-02-25T19:00:00",
    });

    render(<BoardPage />);

    await waitFor(() => expect(BoardApi.getBoard).toHaveBeenCalled());

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Changed text" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(BoardApi.updateBoard).toHaveBeenCalledWith("Changed text");
    });

    expect(screen.getByDisplayValue("Changed text")).toBeInTheDocument();
  });
});
