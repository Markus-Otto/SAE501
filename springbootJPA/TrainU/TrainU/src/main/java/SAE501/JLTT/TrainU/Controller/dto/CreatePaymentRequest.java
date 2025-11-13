package SAE501.JLTT.TrainU.Controller.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

// CreatePaymentRequest.java
public record CreatePaymentRequest(
        @NotNull Long apprenantId,
        @Email @NotBlank String email,
        @NotEmpty @Valid List<Ligne> lignes
) {
    public record Ligne(
            @NotNull Long inscriptionId,
            @NotNull @Positive Integer montantCent
    ) {}
}
