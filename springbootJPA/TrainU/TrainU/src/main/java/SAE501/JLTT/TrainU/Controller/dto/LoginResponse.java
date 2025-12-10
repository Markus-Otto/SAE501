package SAE501.JLTT.TrainU.Controller.dto;



public record LoginResponse(

    Integer id,
    String email,
    String role,
    String token
) {}