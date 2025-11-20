package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.PaiementLigne;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaiementLigneRepository extends JpaRepository<PaiementLigne, Long> {
    List<PaiementLigne> findByPaiement_Id(Long paiementId);
}
