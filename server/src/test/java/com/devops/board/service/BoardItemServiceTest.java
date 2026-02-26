package com.devops.board.service;

import com.devops.board.dto.board.BoardItemResponse;
import com.devops.board.entity.BoardItem;
import com.devops.board.entity.User;
import com.devops.board.exception.ApiException;
import com.devops.board.repository.BoardItemRepository;
import com.devops.board.repository.UserRepository;
import com.devops.board.security.AuthenticatedUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BoardItemServiceTest {

    @Mock
    private BoardItemRepository boardItemRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BoardItemService boardItemService;

    @Test
    void createSuccess() {
        User author = new User();
        author.setId(1L);
        author.setName("Timur");

        BoardItem saved = new BoardItem();
        saved.setId(10L);
        saved.setText("Hello");
        saved.setAuthor(author);
        saved.setLastEditor(author);
        saved.setCreatedAt(LocalDateTime.now());
        saved.setUpdatedAt(LocalDateTime.now());

        when(userRepository.findById(1L)).thenReturn(Optional.of(author));
        when(boardItemRepository.save(any(BoardItem.class))).thenReturn(saved);

        BoardItemResponse response = boardItemService.create("Hello", new AuthenticatedUser(1L, "timur", "Timur"));

        assertEquals(10L, response.getId());
        assertEquals("Hello", response.getText());
        assertEquals("Timur", response.getAuthorName());
        assertEquals("Timur", response.getLastEditorName());
    }

    @Test
    void listReturnsItems() {
        User author = new User();
        author.setId(1L);
        author.setName("Timur");

        BoardItem item = new BoardItem();
        item.setId(100L);
        item.setText("Text");
        item.setAuthor(author);
        item.setLastEditor(author);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        when(boardItemRepository.findAllByOrderByUpdatedAtDesc()).thenReturn(List.of(item));

        List<BoardItemResponse> response = boardItemService.list();

        assertEquals(1, response.size());
        assertEquals(100L, response.get(0).getId());
    }

    @Test
    void getByIdReturnsNotFound() {
        when(boardItemRepository.findById(55L)).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () -> boardItemService.getById(55L));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatus());
    }

    @Test
    void updateByAnotherUserChangesLastEditor() {
        User author = new User();
        author.setId(1L);
        author.setName("Timur");

        User editor = new User();
        editor.setId(2L);
        editor.setName("Other");

        BoardItem item = new BoardItem();
        item.setId(10L);
        item.setText("Old");
        item.setAuthor(author);
        item.setLastEditor(author);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        when(boardItemRepository.findById(10L)).thenReturn(Optional.of(item));
        when(userRepository.findById(2L)).thenReturn(Optional.of(editor));
        when(boardItemRepository.save(any(BoardItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BoardItemResponse response = boardItemService.update(10L, "New", new AuthenticatedUser(2L, "other", "Other"));

        assertEquals("Timur", response.getAuthorName());
        assertEquals("Other", response.getLastEditorName());
    }

    @Test
    void updateSuccess() {
        User author = new User();
        author.setId(1L);
        author.setName("Timur");

        BoardItem item = new BoardItem();
        item.setId(10L);
        item.setText("Old");
        item.setAuthor(author);
        item.setLastEditor(author);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        when(boardItemRepository.findById(10L)).thenReturn(Optional.of(item));
        when(userRepository.findById(1L)).thenReturn(Optional.of(author));
        when(boardItemRepository.save(any(BoardItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BoardItemResponse response = boardItemService.update(10L, "Updated", new AuthenticatedUser(1L, "timur", "Timur"));

        assertEquals("Updated", response.getText());
    }

    @Test
    void deleteSuccess() {
        User author = new User();
        author.setId(1L);

        BoardItem item = new BoardItem();
        item.setId(10L);
        item.setAuthor(author);
        item.setLastEditor(author);

        when(boardItemRepository.findById(10L)).thenReturn(Optional.of(item));

        boardItemService.delete(10L, new AuthenticatedUser(1L, "timur", "Timur"));

        verify(boardItemRepository).delete(item);
    }

    @Test
    void deleteByAnotherUserIsForbidden() {
        User author = new User();
        author.setId(1L);

        BoardItem item = new BoardItem();
        item.setId(10L);
        item.setAuthor(author);
        item.setLastEditor(author);

        when(boardItemRepository.findById(10L)).thenReturn(Optional.of(item));

        ApiException ex = assertThrows(ApiException.class,
            () -> boardItemService.delete(10L, new AuthenticatedUser(2L, "other", "Other")));

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
    }
}
