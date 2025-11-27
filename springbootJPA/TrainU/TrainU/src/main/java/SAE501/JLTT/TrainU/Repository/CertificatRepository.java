package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.Certificat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificatRepository extends JpaRepository<Certificat, Integer> {

    // Trouver tous les certificats d'un apprenant
    List<Certificat> findByApprenantId(Integer idApprenant);

    // Trouver tous les certificats d'une formation
    List<Certificat> findByFormationId(Integer idFormation);

    // Trouver les certificats validés
    List<Certificat> findByValidationTrue();

    // Trouver les certificats non validés
    List<Certificat> findByValidationFalse();

    // Vérifier si un certificat existe pour un apprenant et une formation
    boolean existsByApprenantIdAndFormationId(Integer idApprenant, Integer idFormation);

    // Compter les certificats validés d'un apprenant
    long countByApprenantIdAndValidationTrue(Integer idApprenant);
}