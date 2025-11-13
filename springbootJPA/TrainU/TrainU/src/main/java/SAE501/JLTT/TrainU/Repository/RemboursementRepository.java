package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.Remboursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RemboursementRepository extends JpaRepository<Remboursement, Long> {

    /** Somme des montants remboursés (centimes) pour un paiement donné. */
    @Query("select coalesce(sum(r.montantCent), 0) from Remboursement r where r.paiement.id = :paiementId")
    int sumAmountByPaiementId(Long paiementId);
}
