import { apiRequest } from "./client";
import {
  createBoardItem,
  deleteBoardItem,
  getBoard,
  getBoardItem,
  listBoardItems,
  updateBoard,
  updateBoardItem,
} from "./board";

jest.mock("./client", () => ({
  apiRequest: jest.fn(),
}));

describe("board api", () => {
  beforeEach(() => {
    apiRequest.mockReset();
  });

  test("getBoard calls /api/board", async () => {
    apiRequest.mockResolvedValue({ text: "hello" });

    await getBoard();

    expect(apiRequest).toHaveBeenCalledWith("/api/board");
  });

  test("updateBoard sends PUT payload", async () => {
    apiRequest.mockResolvedValue({ text: "updated" });

    await updateBoard("updated");

    expect(apiRequest).toHaveBeenCalledWith("/api/board", {
      method: "PUT",
      body: { text: "updated" },
    });
  });

  test("createBoardItem sends POST payload", async () => {
    apiRequest.mockResolvedValue({ id: 1, text: "new item" });

    await createBoardItem("new item");

    expect(apiRequest).toHaveBeenCalledWith("/api/board/items", {
      method: "POST",
      body: { text: "new item" },
    });
  });

  test("listBoardItems calls /api/board/items", async () => {
    apiRequest.mockResolvedValue([]);

    await listBoardItems();

    expect(apiRequest).toHaveBeenCalledWith("/api/board/items");
  });

  test("getBoardItem calls /api/board/items/{id}", async () => {
    apiRequest.mockResolvedValue({ id: 42 });

    await getBoardItem(42);

    expect(apiRequest).toHaveBeenCalledWith("/api/board/items/42");
  });

  test("updateBoardItem sends PUT payload to /api/board/items/{id}", async () => {
    apiRequest.mockResolvedValue({ id: 42, text: "updated item" });

    await updateBoardItem(42, "updated item");

    expect(apiRequest).toHaveBeenCalledWith("/api/board/items/42", {
      method: "PUT",
      body: { text: "updated item" },
    });
  });

  test("deleteBoardItem sends DELETE to /api/board/items/{id}", async () => {
    apiRequest.mockResolvedValue({});

    await deleteBoardItem(42);

    expect(apiRequest).toHaveBeenCalledWith("/api/board/items/42", {
      method: "DELETE",
    });
  });
});
