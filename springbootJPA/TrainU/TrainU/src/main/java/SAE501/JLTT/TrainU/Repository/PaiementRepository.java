package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.Paiement;
import SAE501.JLTT.TrainU.Model.PaiementStatut;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    List<Paiement> findByStatutAndDateCreationBefore(PaiementStatut statut, Instant before);
}
