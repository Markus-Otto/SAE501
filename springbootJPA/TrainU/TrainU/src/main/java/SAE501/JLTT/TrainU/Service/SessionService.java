package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Model.Session;
import SAE501.JLTT.TrainU.Model.Formation;
import SAE501.JLTT.TrainU.Repository.SessionRepository;
import SAE501.JLTT.TrainU.Repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final FormationRepository formationRepository;

    public List<Session> getByFormationId(Integer idFormation) {
        return sessionRepository.findByFormationId(idFormation);
    }

    public SessionService(SessionRepository sessionRepository, FormationRepository formationRepository) {
        this.sessionRepository = sessionRepository;
        this.formationRepository = formationRepository;
    }

    public List<Session> getAll() {
        return sessionRepository.findAll();
    }

    public Session getById(Integer id) {
        return sessionRepository.findById(id).orElse(null);
    }

    public Session create(Session session, Integer idFormation) {
        Formation formation = formationRepository.findById(idFormation)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        session.setFormation(formation);
        return sessionRepository.save(session);
    }

    public Session update(Integer id, Session session) {
        session.setId(id);
        return sessionRepository.save(session);
    }

    public void delete(Integer id) {
        sessionRepository.deleteById(id);
    }
}
