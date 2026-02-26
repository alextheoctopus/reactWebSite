package com.devops.board.dto.auth;

public class UserDto {

    private final Long id;
    private final String name;
    private final String login;

    public UserDto(Long id, String name, String login) {
        this.id = id;
        this.name = name;
        this.login = login;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLogin() {
        return login;
    }
}
