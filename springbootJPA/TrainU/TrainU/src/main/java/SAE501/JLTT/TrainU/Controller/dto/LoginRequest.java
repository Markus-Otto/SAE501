package SAE501.JLTT.TrainU.Controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password,
        @Pattern(regexp = "apprenant|intervenant|admin") String role
) {}