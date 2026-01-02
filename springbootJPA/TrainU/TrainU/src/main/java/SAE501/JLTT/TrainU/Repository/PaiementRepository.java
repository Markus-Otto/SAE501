package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.Paiement;
import SAE501.JLTT.TrainU.Model.PaiementStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.Instant;
import java.util.List;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    List<Paiement> findByStatutAndDateCreationBefore(PaiementStatut statut, Instant before);

    // CETTE REQUÊTE EST LA CLÉ :
    // Elle "aspire" toutes les données liées en une seule fois
    @Query("SELECT DISTINCT p FROM Paiement p " +
            "LEFT JOIN FETCH p.lignes l " +           // Paiement -> Ligne
            "LEFT JOIN FETCH l.inscription i " +      // Ligne -> Inscription
            "LEFT JOIN FETCH i.session s " +          // Inscription -> Session (CRUCIAL)
            "WHERE p.apprenantId = :apprenantId " +
            "ORDER BY p.dateCreation DESC")
    List<Paiement> findByApprenantId(@Param("apprenantId") Long apprenantId);
}