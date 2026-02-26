package com.devops.board.dto.board;

import java.time.LocalDateTime;

public class BoardItemResponse {

    private final Long id;
    private final String text;
    private final Long authorId;
    private final String authorName;
    private final Long lastEditorId;
    private final String lastEditorName;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public BoardItemResponse(Long id,
                             String text,
                             Long authorId,
                             String authorName,
                             Long lastEditorId,
                             String lastEditorName,
                             LocalDateTime createdAt,
                             LocalDateTime updatedAt) {
        this.id = id;
        this.text = text;
        this.authorId = authorId;
        this.authorName = authorName;
        this.lastEditorId = lastEditorId;
        this.lastEditorName = lastEditorName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public Long getLastEditorId() {
        return lastEditorId;
    }

    public String getLastEditorName() {
        return lastEditorName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
