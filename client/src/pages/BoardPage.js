import { useEffect, useState } from "react";
import { getBoard, updateBoard } from "../api/board";

export default function BoardPage() {
  const [board, setBoard] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBoard() {
      setLoading(true);
      setError("");

      try {
        const data = await getBoard();
        if (!cancelled) {
          setBoard(data);
          setText(data?.text || "");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Failed to load board");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBoard();

    return () => {
      cancelled = true;
    };
  }, []);

  const save = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Board text must not be empty");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const updated = await updateBoard(trimmed);
      setBoard(updated);
      setText(updated?.text || "");
    } catch (e) {
      setError(e?.message || "Failed to update board");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="contentContainer">
      <h2>Shared Board</h2>

      {error ? <div className="authError">{error}</div> : null}

      {loading ? <p>Loading...</p> : null}

      {!loading && board ? (
        <div>
          <p>
            <strong>Last author:</strong> {board.authorName || "Unknown"}
          </p>
          <p>
            <strong>Updated:</strong> {board.updatedAt || "-"}
          </p>

          <textarea
            rows={8}
            style={{ width: "100%", boxSizing: "border-box", marginBottom: 12 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button className="createBtn" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
