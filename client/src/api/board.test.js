import { apiRequest } from "./client";
import { getBoard, updateBoard } from "./board";

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
});
