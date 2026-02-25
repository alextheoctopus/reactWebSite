package com.devops.board.security;

public class AuthenticatedUser {

    private final Long id;
    private final String login;
    private final String name;

    public AuthenticatedUser(Long id, String login, String name) {
        this.id = id;
        this.login = login;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }

    public String getName() {
        return name;
    }
}
