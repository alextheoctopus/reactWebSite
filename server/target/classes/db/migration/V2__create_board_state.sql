CREATE TABLE board_state (
    id BIGINT PRIMARY KEY,
    text TEXT NOT NULL,
    author_id BIGINT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_board_author FOREIGN KEY (author_id) REFERENCES users(id)
);

INSERT INTO board_state (id, text, author_id, updated_at)
VALUES (1, '', NULL, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
