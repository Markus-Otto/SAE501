package SAE501.JLTT.TrainU.Controller.dto;

public record RefundRequest(
        Long paiementLigneId,  // null => remboursement global
        Integer montantCent,   // null => total (ligne ou global)
        String motif,
        String noteInterne
) { }
