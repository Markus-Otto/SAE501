// src/main/java/SAE501/JLTT/TrainU/Controller/dto/PaiementListItem.java
package SAE501.JLTT.TrainU.Controller.dto;

import SAE501.JLTT.TrainU.Model.PaiementStatut;
import java.time.Instant;

public record PaiementListItem(
        Long id,
        Long apprenantId,
        Integer montantTotalCent,
        String devise,
        PaiementStatut statut,
        String stripeIntentId,
        Instant dateCreation
) {}
