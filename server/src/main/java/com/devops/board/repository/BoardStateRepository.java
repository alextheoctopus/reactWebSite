package com.devops.board.repository;

import com.devops.board.entity.BoardState;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardStateRepository extends JpaRepository<BoardState, Long> {
}
