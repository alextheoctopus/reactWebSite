ALTER TABLE board_items
    ADD COLUMN last_editor_id BIGINT;

UPDATE board_items
SET last_editor_id = author_id
WHERE last_editor_id IS NULL;

ALTER TABLE board_items
    ALTER COLUMN last_editor_id SET NOT NULL;

ALTER TABLE board_items
    ADD CONSTRAINT fk_board_items_last_editor
        FOREIGN KEY (last_editor_id) REFERENCES users(id);

CREATE INDEX idx_board_items_last_editor_id ON board_items(last_editor_id);
