package com.devops.board.controller;

import com.devops.board.dto.board.BoardResponse;
import com.devops.board.dto.board.BoardItemResponse;
import com.devops.board.dto.board.CreateBoardItemRequest;
import com.devops.board.dto.board.UpdateBoardItemRequest;
import com.devops.board.dto.board.UpdateBoardRequest;
import com.devops.board.security.AuthenticatedUser;
import com.devops.board.service.BoardItemService;
import com.devops.board.service.BoardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/board")
public class BoardController {

    private final BoardService boardService;
    private final BoardItemService boardItemService;

    public BoardController(BoardService boardService, BoardItemService boardItemService) {
        this.boardService = boardService;
        this.boardItemService = boardItemService;
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

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public BoardItemResponse createBoardItem(@Valid @RequestBody CreateBoardItemRequest request,
                                             Authentication authentication) {
        AuthenticatedUser principal = (AuthenticatedUser) authentication.getPrincipal();
        return boardItemService.create(request.getText(), principal);
    }

    @GetMapping("/items")
    public List<BoardItemResponse> listBoardItems() {
        return boardItemService.list();
    }

    @GetMapping("/items/{id}")
    public BoardItemResponse getBoardItem(@PathVariable Long id) {
        return boardItemService.getById(id);
    }

    @PutMapping("/items/{id}")
    public BoardItemResponse updateBoardItem(@PathVariable Long id,
                                             @Valid @RequestBody UpdateBoardItemRequest request,
                                             Authentication authentication) {
        AuthenticatedUser principal = (AuthenticatedUser) authentication.getPrincipal();
        return boardItemService.update(id, request.getText(), principal);
    }

    @DeleteMapping("/items/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBoardItem(@PathVariable Long id, Authentication authentication) {
        AuthenticatedUser principal = (AuthenticatedUser) authentication.getPrincipal();
        boardItemService.delete(id, principal);
    }
}
