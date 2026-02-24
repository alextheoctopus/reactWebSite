import { apiRequest } from "./client";

export async function listNotes() {
  return apiRequest("/api/notes");
}

export async function createNote(value) {
  return apiRequest("/api/notes", {
    method: "POST",
    body: { value },
  });
}

export async function updateNote(id, value) {
  return apiRequest(`/api/notes/${id}`, {
    method: "PUT",
    body: { value },
  });
}

export async function deleteNote(id) {
  // обычно 204 без json — наш apiRequest норм, просто вернёт текст/null
  return apiRequest(`/api/notes/${id}`, {
    method: "DELETE",
  });
}