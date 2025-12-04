package com.backend.recipe_organizer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
@Document
public class User {

@Id
private String id;
private String username;
@Email
private String email;
private String password;
    
}
