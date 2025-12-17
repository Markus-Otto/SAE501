package SAE501.JLTT.TrainU.Controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LoginRequest(

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Format d'email invalide")
        String email,

        @NotBlank(message = "Le mot de passe est obligatoire")
        String password,

        @Pattern(
                regexp = "apprenant|intervenant|admin",
                message = "Le rôle doit être 'apprenant', 'intervenant' ou 'admin'"
        )
        String role
) {}