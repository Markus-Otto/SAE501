package SAE501.JLTT.TrainU.Controller.dto;

public record RefundResponse(
        Long remboursementId,
        String refundId,
        String status,
        String paiementStatut // "PARTIALLY_REFUNDED" / "REFUNDED"
) {}
