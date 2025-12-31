package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


// L'interface étend JpaRepository, avec le type d'entité (Inscription)
public interface InscriptionRepository extends JpaRepository<Inscription, Integer> {

    List<Inscription> findBySessionId(Integer sessionId);
    List<Inscription> findByApprenantId(Integer apprenantId);
}

