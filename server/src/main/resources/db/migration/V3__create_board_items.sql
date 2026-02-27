CREATE TABLE board_items (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_board_items_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_board_items_author_id ON board_items(author_id);
CREATE INDEX idx_board_items_updated_at ON board_items(updated_at DESC);
