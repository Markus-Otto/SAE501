package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Model.Apprenant;
import SAE501.JLTT.TrainU.Repository.ApprenantRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApprenantService {

    private final ApprenantRepository apprenantRepository;
    private final PasswordEncoder passwordEncoder;

    public ApprenantService(ApprenantRepository apprenantRepository,
                            PasswordEncoder passwordEncoder) {
        this.apprenantRepository = apprenantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Apprenant creerApprenant(Apprenant apprenant) {
        //  Hasher le mot de passe avant d’enregistrer
        if (apprenant.getMotDePasse() != null && !apprenant.getMotDePasse().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(apprenant.getMotDePasse());
            apprenant.setMotDePasse(hashedPassword);
        }

        return apprenantRepository.save(apprenant);
    }

    public List<Apprenant> getAllApprenants() {
        return apprenantRepository.findAll();
    }

    public Optional<Apprenant> getApprenantById(Integer id) {
        return apprenantRepository.findById(id);
    }

    public void supprimerApprenant(Integer id) {
        apprenantRepository.deleteById(id);
    }
}
