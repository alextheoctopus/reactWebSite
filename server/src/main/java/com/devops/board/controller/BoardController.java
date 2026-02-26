package com.devops.board.controller;

import com.devops.board.dto.board.BoardResponse;
import com.devops.board.dto.board.UpdateBoardRequest;
import com.devops.board.security.AuthenticatedUser;
import com.devops.board.service.BoardService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/board")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping
    public BoardResponse getBoard() {
        return boardService.getBoard();
    }

    @PutMapping
    public BoardResponse updateBoard(@Valid @RequestBody UpdateBoardRequest request,
                                     Authentication authentication) {
        AuthenticatedUser principal = (AuthenticatedUser) authentication.getPrincipal();
        return boardService.updateBoard(request.getText(), principal);
    }
}
