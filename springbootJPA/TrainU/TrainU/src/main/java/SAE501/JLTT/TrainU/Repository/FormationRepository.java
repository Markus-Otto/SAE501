package SAE501.JLTT.TrainU.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import SAE501.JLTT.TrainU.Model.Formation;

import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Integer> {
    List<Formation> findByActiveTrue();
}
