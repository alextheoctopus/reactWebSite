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

export async function createBoardItem(text) {
  return apiRequest("/api/board/items", {
    method: "POST",
    body: { text },
  });
}

export async function listBoardItems() {
  return apiRequest("/api/board/items");
}

export async function getBoardItem(id) {
  return apiRequest(`/api/board/items/${id}`);
}

export async function updateBoardItem(id, text) {
  return apiRequest(`/api/board/items/${id}`, {
    method: "PUT",
    body: { text },
  });
}

export async function deleteBoardItem(id) {
  return apiRequest(`/api/board/items/${id}`, {
    method: "DELETE",
  });
}
