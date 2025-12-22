package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.Emargement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmargementRepository extends JpaRepository<Emargement, Integer> {

    List<Emargement> findByApprenantId(Integer id);
}