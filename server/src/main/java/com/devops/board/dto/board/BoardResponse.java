package com.devops.board.dto.board;

import java.time.LocalDateTime;

public class BoardResponse {

    private final String text;
    private final String authorName;
    private final LocalDateTime updatedAt;

    public BoardResponse(String text, String authorName, LocalDateTime updatedAt) {
        this.text = text;
        this.authorName = authorName;
        this.updatedAt = updatedAt;
    }

    public String getText() {
        return text;
    }

    public String getAuthorName() {
        return authorName;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
