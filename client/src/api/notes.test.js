import { createNote, deleteNote, listNotes, updateNote } from "./notes";
import { apiRequest } from "./client";

jest.mock("./client", () => ({
  apiRequest: jest.fn(),
}));

describe("notes api", () => {
  beforeEach(() => {
    apiRequest.mockReset();
  });

  test("listNotes calls /api/notes", async () => {
    apiRequest.mockResolvedValue([]);

    await listNotes();

    expect(apiRequest).toHaveBeenCalledWith("/api/notes");
  });

  test("createNote sends POST payload", async () => {
    apiRequest.mockResolvedValue({ id: 1, value: "Draft" });

    await createNote("Draft");

    expect(apiRequest).toHaveBeenCalledWith("/api/notes", {
      method: "POST",
      body: { value: "Draft" },
    });
  });

  test("updateNote sends PUT payload", async () => {
    apiRequest.mockResolvedValue({ id: 7, value: "Updated" });

    await updateNote(7, "Updated");

    expect(apiRequest).toHaveBeenCalledWith("/api/notes/7", {
      method: "PUT",
      body: { value: "Updated" },
    });
  });

  test("deleteNote sends DELETE", async () => {
    apiRequest.mockResolvedValue(null);

    await deleteNote(5);

    expect(apiRequest).toHaveBeenCalledWith("/api/notes/5", {
      method: "DELETE",
    });
  });
});
