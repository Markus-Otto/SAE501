package SAE501.JLTT.TrainU.Controller.dto;

public record CreatePaymentResponse(
        Long paiementId,
        String paymentIntentId,
        String clientSecret,
        Integer amountCent,
        String currency,
        String status
) { }
