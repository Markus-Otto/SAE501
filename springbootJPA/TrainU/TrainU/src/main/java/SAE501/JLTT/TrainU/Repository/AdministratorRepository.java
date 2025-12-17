package SAE501.JLTT.TrainU.Repository;

import SAE501.JLTT.TrainU.Model.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdministratorRepository extends JpaRepository<Administrator, Integer> {
    Optional<Administrator> findByLogin(String login);
}
