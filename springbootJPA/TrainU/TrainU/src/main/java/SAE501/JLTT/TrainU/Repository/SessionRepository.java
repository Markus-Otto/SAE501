package SAE501.JLTT.TrainU.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import SAE501.JLTT.TrainU.Model.Session;

public interface SessionRepository extends JpaRepository<Session, Integer> {
}
