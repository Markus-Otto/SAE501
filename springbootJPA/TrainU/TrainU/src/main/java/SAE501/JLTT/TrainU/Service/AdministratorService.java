package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Model.Administrator;
import SAE501.JLTT.TrainU.Model.Apprenant;
import SAE501.JLTT.TrainU.Repository.AdministratorRepository;
import SAE501.JLTT.TrainU.Repository.ApprenantRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdministratorService {

    private final AdministratorRepository administratorRepository;
    private final PasswordEncoder passwordEncoder;

    public AdministratorService(AdministratorRepository administratorRepository,
                            PasswordEncoder passwordEncoder) {
        this.administratorRepository = administratorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Administrator creerAdministrator(Administrator administrator) {
        //  Hasher le mot de passe avant d’enregistrer
        if (administrator.getMotDePasse() != null && !administrator.getMotDePasse().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(administrator.getMotDePasse());
            administrator.setMotDePasse(hashedPassword);
        }

        return administratorRepository.save(administrator);
    }

    public List<Administrator> getAllAdministrator() {
        return administratorRepository.findAll();
    }

    public Optional<Administrator> getAdministratorById(Integer id) {
        return administratorRepository.findById(id); }

    public void supprimerAdministrator(Integer id) {
        administratorRepository.deleteById(id); }
}
