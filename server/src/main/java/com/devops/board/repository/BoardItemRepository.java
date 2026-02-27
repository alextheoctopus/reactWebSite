package com.devops.board.repository;

import com.devops.board.entity.BoardItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardItemRepository extends JpaRepository<BoardItem, Long> {

    List<BoardItem> findAllByOrderByUpdatedAtDesc();
}
