package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.Apprenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApprenantRepository extends JpaRepository<Apprenant, Integer> {
    Optional<Apprenant> findByEmail(String email);
}