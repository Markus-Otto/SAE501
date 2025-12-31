// src/main/java/SAE501/JLTT/TrainU/Controller/dto/PaiementDetails.java
package SAE501.JLTT.TrainU.Controller.dto;

import SAE501.JLTT.TrainU.Model.PaiementStatut;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public record PaiementDetails(
        Long id,
        Integer apprenantId,
        Integer montantTotalCent,
        String devise,
        PaiementStatut statut,
        String stripeIntentId,
        Instant dateCreation,
        List<Ligne> lignes
) {
    public record Ligne(
            Integer inscriptionId,
            Integer montantCent,
            String formationTitre,
            LocalDateTime dateDebut,
            LocalDateTime dateFin
    ) {}
}
