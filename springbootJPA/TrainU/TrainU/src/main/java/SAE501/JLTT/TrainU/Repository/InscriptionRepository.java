package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;


// L'interface étend JpaRepository, avec le type d'entité (Inscription)
public interface InscriptionRepository extends JpaRepository<Inscription, Integer> {}

