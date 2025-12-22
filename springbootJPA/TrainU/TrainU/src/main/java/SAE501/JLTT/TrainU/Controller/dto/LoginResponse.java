package SAE501.JLTT.TrainU.Controller.dto;

public record LoginResponse(
        Integer id,
        String email,
        String nom,
        String prenom,
        String role,
        String token
) {}