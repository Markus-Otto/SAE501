package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.Certificat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CertificatRepository extends JpaRepository<Certificat, Integer> {
    // Utilise ApprenantId (JPA fera le lien avec l'ID dans l'objet Apprenant)
    List<Certificat> findByApprenantId(Integer idApprenant);

    List<Certificat> findByFormationId(Integer idFormation);

    List<Certificat> findByValidationTrue();
}