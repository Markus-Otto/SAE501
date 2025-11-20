package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Model.Apprenant;
import SAE501.JLTT.TrainU.Model.Intervenant;
import SAE501.JLTT.TrainU.Repository.ApprenantRepository;
import SAE501.JLTT.TrainU.Repository.IntervenantRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IntervenantService {

    private final IntervenantRepository intervenantRepository;
    private final PasswordEncoder passwordEncoder;

    public IntervenantService(IntervenantRepository intervenantRepository,
                            PasswordEncoder passwordEncoder) {
        this.intervenantRepository = intervenantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Intervenant creerIntervenant(Intervenant intervenant) {
        //  Hasher le mot de passe avant d’enregistrer
        if (intervenant.getMotDePasse() != null && !intervenant.getMotDePasse().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(intervenant.getMotDePasse());
            intervenant.setMotDePasse(hashedPassword);
        }

        return intervenantRepository.save(intervenant);
    }

    public List<Intervenant> getAllIntervenants() {
        return intervenantRepository.findAll();
    }

    public Optional<Intervenant> getIntervenantById(Integer id) {
        return intervenantRepository.findById(id);
    }

    public void delIntervenant(Integer id) {
        intervenantRepository.deleteById(id);
    }
}
