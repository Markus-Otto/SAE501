package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.PaiementLigne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaiementLigneRepository extends JpaRepository<PaiementLigne, Long> {
    // Dans PaiementLigneRepository.java
    @Query("SELECT l FROM PaiementLigne l " +
            "JOIN FETCH l.inscription i " +
            "JOIN FETCH i.session s " +
            "JOIN FETCH l.paiement p " + // On récupère aussi le paiement parent
            "WHERE p.apprenantId = :apprenantId " +
            "ORDER BY p.dateCreation DESC")
    List<PaiementLigne> findAllLignesByApprenantId(@Param("apprenantId") Long apprenantId);
    List<PaiementLigne> findByPaiement_Id(Long paiementId);
}
