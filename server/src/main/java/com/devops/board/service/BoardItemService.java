package com.devops.board.service;

import com.devops.board.dto.board.BoardItemResponse;
import com.devops.board.entity.BoardItem;
import com.devops.board.entity.User;
import com.devops.board.exception.ApiException;
import com.devops.board.repository.BoardItemRepository;
import com.devops.board.repository.UserRepository;
import com.devops.board.security.AuthenticatedUser;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BoardItemService {

    private final BoardItemRepository boardItemRepository;
    private final UserRepository userRepository;

    public BoardItemService(BoardItemRepository boardItemRepository,
                            UserRepository userRepository) {
        this.boardItemRepository = boardItemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BoardItemResponse create(String text, AuthenticatedUser principal) {
        String trimmed = normalizeText(text);
        User author = getCurrentUser(principal);

        BoardItem item = new BoardItem();
        item.setText(trimmed);
        item.setAuthor(author);
        item.setLastEditor(author);

        BoardItem saved = boardItemRepository.save(item);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BoardItemResponse> list() {
        return boardItemRepository.findAllByOrderByUpdatedAtDesc()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public BoardItemResponse getById(Long id) {
        BoardItem item = boardItemRepository.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Board item not found"));
        return toResponse(item);
    }

    @Transactional
    public BoardItemResponse update(Long id, String text, AuthenticatedUser principal) {
        String trimmed = normalizeText(text);
        User editor = getCurrentUser(principal);

        BoardItem item = boardItemRepository.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Board item not found"));

        item.setText(trimmed);
        item.setLastEditor(editor);

        BoardItem saved = boardItemRepository.save(item);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id, AuthenticatedUser principal) {
        BoardItem item = boardItemRepository.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Board item not found"));

        assertAuthor(item, principal);
        boardItemRepository.delete(item);
    }

    private User getCurrentUser(AuthenticatedUser principal) {
        return userRepository.findById(principal.getId())
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
    }

    private String normalizeText(String text) {
        String trimmed = text == null ? "" : text.trim();
        if (trimmed.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Text must not be empty");
        }
        return trimmed;
    }

    private void assertAuthor(BoardItem item, AuthenticatedUser principal) {
        Long authorId = item.getAuthor() != null ? item.getAuthor().getId() : null;
        if (authorId == null || !authorId.equals(principal.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }

    private BoardItemResponse toResponse(BoardItem item) {
        User author = item.getAuthor();
        User lastEditor = item.getLastEditor();
        return new BoardItemResponse(
            item.getId(),
            item.getText(),
            author != null ? author.getId() : null,
            author != null ? author.getName() : null,
            lastEditor != null ? lastEditor.getId() : null,
            lastEditor != null ? lastEditor.getName() : null,
            item.getCreatedAt(),
            item.getUpdatedAt()
        );
    }
}
