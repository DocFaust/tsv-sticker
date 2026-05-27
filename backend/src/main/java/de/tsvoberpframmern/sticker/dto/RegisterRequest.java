package de.tsvoberpframmern.sticker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank String nickname,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 6, message = "Passwort muss mindestens 6 Zeichen lang sein.") String password
) {}
