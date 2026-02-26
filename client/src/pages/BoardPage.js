import { useEffect, useState } from "react";
import {
  createBoardItem,
  deleteBoardItem,
  listBoardItems,
  updateBoardItem,
} from "../api/board";

export default function BoardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createText, setCreateText] = useState("");
  const [createSaving, setCreateSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [savingItemId, setSavingItemId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setLoading(true);
      setError("");

      try {
        const data = await listBoardItems();
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Failed to load board items");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      cancelled = true;
    };
  }, []);

  const createItem = async () => {
    const trimmed = createText.trim();
    if (!trimmed) {
      setError("Board text must not be empty");
      return;
    }

    setCreateSaving(true);
    setError("");

    try {
      const created = await createBoardItem(trimmed);
      setItems((prev) => [created, ...prev]);
      setCreateText("");
    } catch (e) {
      setError(e?.message || "Failed to create board item");
    } finally {
      setCreateSaving(false);
    }
  };

  const startEdit = (item) => {
    setError("");
    setEditingId(item.id);
    setEditingText(item.text || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = async (id) => {
    const trimmed = editingText.trim();
    if (!trimmed) {
      setError("Board text must not be empty");
      return;
    }

    setSavingItemId(id);
    setError("");

    try {
      const updated = await updateBoardItem(id, trimmed);
      setItems((prev) => [updated, ...prev.filter((item) => item.id !== id)]);
      cancelEdit();
    } catch (e) {
      setError(e?.message || "Failed to update board item");
    } finally {
      setSavingItemId(null);
    }
  };

  const removeItem = async (id) => {
    setDeletingItemId(id);
    setError("");

    try {
      await deleteBoardItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        cancelEdit();
      }
    } catch (e) {
      setError(e?.message || "Failed to delete board item");
    } finally {
      setDeletingItemId(null);
    }
  };

  return (
    <div className="contentContainer">
      <h2>Shared Board</h2>

      {error ? <div className="authError">{error}</div> : null}

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="new-board-item">
          <strong>New item text</strong>
        </label>
        <textarea
          id="new-board-item"
          aria-label="New item text"
          rows={4}
          style={{ width: "100%", boxSizing: "border-box", margin: "8px 0 12px" }}
          value={createText}
          onChange={(e) => setCreateText(e.target.value)}
        />
        <button className="createBtn" onClick={createItem} disabled={createSaving}>
          {createSaving ? "Creating..." : "Create"}
        </button>
      </div>

      {loading ? <p>Loading...</p> : null}

      {!loading && items.length === 0 ? <p>No items yet.</p> : null}

      {!loading ? (
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              data-testid={`board-item-${item.id}`}
              style={{
                border: "1px solid #dfe3ea",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                background: "#fff",
              }}
            >
              <p style={{ margin: "0 0 6px" }}>
                <strong>Author:</strong> {item.authorName || "Unknown"}
              </p>
              <p style={{ margin: "0 0 10px" }}>
                <strong>Updated:</strong> {item.updatedAt || "-"}
              </p>

              {editingId === item.id ? (
                <div>
                  <textarea
                    aria-label={`Edit item ${item.id} text`}
                    rows={4}
                    style={{ width: "100%", boxSizing: "border-box", marginBottom: 10 }}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button
                    className="createBtn"
                    onClick={() => saveEdit(item.id)}
                    disabled={savingItemId === item.id}
                    style={{ marginRight: 8 }}
                  >
                    {savingItemId === item.id ? "Saving..." : "Save"}
                  </button>
                  <button onClick={cancelEdit} disabled={savingItemId === item.id}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ whiteSpace: "pre-wrap", marginTop: 0 }}>{item.text}</p>
                  <button
                    onClick={() => startEdit(item)}
                    disabled={deletingItemId === item.id}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={deletingItemId === item.id}
                  >
                    {deletingItemId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
