// src/main/java/SAE501/JLTT/TrainU/Controller/dto/PaiementListItem.java
package SAE501.JLTT.TrainU.Controller.dto;

import SAE501.JLTT.TrainU.Model.PaiementStatut;
import java.time.Instant;
import java.util.List; // Import à ajouter
public record PaiementListItem(
        Long id,
        Integer apprenantId,
        Integer montantTotalCent,
        String devise,
        PaiementStatut statut,
        String stripeIntentId,
        Instant dateCreation,
        List<PaiementDetails.Ligne> lignes // <--- CE CHAMP DOIT ÊTRE PRÉSENT
) {}