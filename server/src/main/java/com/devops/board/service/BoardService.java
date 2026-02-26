package com.devops.board.service;

import com.devops.board.dto.board.BoardResponse;
import com.devops.board.entity.BoardState;
import com.devops.board.entity.User;
import com.devops.board.exception.ApiException;
import com.devops.board.repository.BoardStateRepository;
import com.devops.board.repository.UserRepository;
import com.devops.board.security.AuthenticatedUser;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class BoardService {

    private static final long BOARD_ID = 1L;

    private final BoardStateRepository boardStateRepository;
    private final UserRepository userRepository;

    public BoardService(BoardStateRepository boardStateRepository, UserRepository userRepository) {
        this.boardStateRepository = boardStateRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public BoardResponse getBoard() {
        BoardState boardState = boardStateRepository.findById(BOARD_ID).orElseGet(this::createEmptyBoard);
        return toResponse(boardState);
    }

    @Transactional
    public BoardResponse updateBoard(String text, AuthenticatedUser principal) {
        String trimmed = text == null ? "" : text.trim();
        if (trimmed.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Text must not be empty");
        }

        User author = userRepository.findById(principal.getId())
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized"));

        BoardState boardState = boardStateRepository.findById(BOARD_ID).orElseGet(this::createEmptyBoard);
        boardState.setText(trimmed);
        boardState.setAuthor(author);
        boardState.setUpdatedAt(LocalDateTime.now());

        BoardState saved = boardStateRepository.save(boardState);
        return toResponse(saved);
    }

    private BoardState createEmptyBoard() {
        BoardState board = new BoardState();
        board.setId(BOARD_ID);
        board.setText("");
        board.setUpdatedAt(LocalDateTime.now());
        return boardStateRepository.save(board);
    }

    private BoardResponse toResponse(BoardState boardState) {
        String authorName = boardState.getAuthor() != null ? boardState.getAuthor().getName() : null;
        return new BoardResponse(boardState.getText(), authorName, boardState.getUpdatedAt());
    }
}
