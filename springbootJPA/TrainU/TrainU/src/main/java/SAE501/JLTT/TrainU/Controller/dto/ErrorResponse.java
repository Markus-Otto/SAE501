package SAE501.JLTT.TrainU.Controller.dto;



public record ErrorResponse(

    int status,
    String error,
    String message

) {}