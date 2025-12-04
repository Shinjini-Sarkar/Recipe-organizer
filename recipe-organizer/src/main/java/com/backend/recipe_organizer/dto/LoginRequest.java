package com.backend.recipe_organizer.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
