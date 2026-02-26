import { apiRequest } from "./client";

export async function getBoard() {
  return apiRequest("/api/board");
}

export async function updateBoard(text) {
  return apiRequest("/api/board", {
    method: "PUT",
    body: { text },
  });
}
