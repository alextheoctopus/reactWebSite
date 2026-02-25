package com.devops.board.service;

import com.devops.board.dto.board.BoardResponse;
import com.devops.board.entity.BoardState;
import com.devops.board.entity.User;
import com.devops.board.exception.ApiException;
import com.devops.board.repository.BoardStateRepository;
import com.devops.board.repository.UserRepository;
import com.devops.board.security.AuthenticatedUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BoardServiceTest {

    @Mock
    private BoardStateRepository boardStateRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BoardService boardService;

    @Test
    void getBoardReturnsCurrentState() {
        User user = new User();
        user.setName("Timur");

        BoardState state = new BoardState();
        state.setId(1L);
        state.setText("Hello");
        state.setAuthor(user);
        state.setUpdatedAt(LocalDateTime.now());

        when(boardStateRepository.findById(1L)).thenReturn(Optional.of(state));

        BoardResponse response = boardService.getBoard();

        assertEquals("Hello", response.getText());
        assertEquals("Timur", response.getAuthorName());
    }

    @Test
    void updateBoardRejectsEmptyText() {
        ApiException ex = assertThrows(ApiException.class,
            () -> boardService.updateBoard("   ", new AuthenticatedUser(1L, "timur", "Timur")));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
    }

    @Test
    void updateBoardSuccess() {
        User author = new User();
        author.setId(1L);
        author.setName("Timur");

        BoardState state = new BoardState();
        state.setId(1L);
        state.setText("Old");

        when(userRepository.findById(1L)).thenReturn(Optional.of(author));
        when(boardStateRepository.findById(1L)).thenReturn(Optional.of(state));
        when(boardStateRepository.save(any(BoardState.class))).thenAnswer(inv -> inv.getArgument(0));

        BoardResponse response = boardService.updateBoard("New text", new AuthenticatedUser(1L, "timur", "Timur"));

        assertEquals("New text", response.getText());
        assertEquals("Timur", response.getAuthorName());
    }
}
