package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Model.Emargement;
import SAE501.JLTT.TrainU.Model.Session;
import SAE501.JLTT.TrainU.Model.Apprenant;
import SAE501.JLTT.TrainU.Repository.EmargementRepository;
import SAE501.JLTT.TrainU.Repository.SessionRepository;
import SAE501.JLTT.TrainU.Repository.ApprenantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmargementService {

    private final EmargementRepository emargementRepository;
    private final SessionRepository sessionRepository;
    private final ApprenantRepository apprenantRepository;

    public EmargementService(EmargementRepository er, SessionRepository sr, ApprenantRepository ar) {
        this.emargementRepository = er;
        this.sessionRepository = sr;
        this.apprenantRepository = ar;
    }


    public List<Emargement> getByApprenant(Integer idApprenant) {
        return emargementRepository.findByApprenantId(idApprenant);
    }

    public List<Emargement> getAll() {
        return emargementRepository.findAll();
    }

    public Emargement create(Integer idSession, Integer idApprenant, Boolean present) {
        Session session = sessionRepository.findById(idSession)
                .orElseThrow(() -> new RuntimeException("Session introuvable"));

        Apprenant apprenant = apprenantRepository.findById(idApprenant)
                .orElseThrow(() -> new RuntimeException("Apprenant introuvable"));

        Emargement e = new Emargement();
        e.setSession(session);
        e.setApprenant(apprenant);
        e.setPresent(present);

        return emargementRepository.save(e);
    }
}