package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.Intervenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IntervenantRepository extends JpaRepository<Intervenant, Integer> {
    Optional<Intervenant> findByEmail(String email);
}