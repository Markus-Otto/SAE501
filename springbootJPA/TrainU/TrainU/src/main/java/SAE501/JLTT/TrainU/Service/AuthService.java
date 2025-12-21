package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Controller.dto.LoginRequest;
import SAE501.JLTT.TrainU.Controller.dto.LoginResponse;
import SAE501.JLTT.TrainU.Model.Administrator;
import SAE501.JLTT.TrainU.Model.Apprenant;
import SAE501.JLTT.TrainU.Model.Intervenant;
import SAE501.JLTT.TrainU.Repository.AdministratorRepository;
import SAE501.JLTT.TrainU.Repository.ApprenantRepository;
import SAE501.JLTT.TrainU.Repository.IntervenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ApprenantRepository apprenantRepo;
    private final IntervenantRepository intervenantRepo;
    private final AdministratorRepository adminRepo;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest req) {
        String email = req.email();
        String password = req.password();

        // 1. Test APPRENANT (cherche par Email)
        var apprenantOpt = apprenantRepo.findByEmail(email);
        if (apprenantOpt.isPresent()) {
            Apprenant a = apprenantOpt.get();
            if (passwordEncoder.matches(password, a.getMotDePasse())) {
                if (!a.getActive()) throw new RuntimeException("Compte désactivé");
                return new LoginResponse(a.getId(), a.getEmail(), "apprenant", "TOKEN_APP_" + a.getId());
            }
        }

        // 2. Test INTERVENANT (cherche par Email)
        var intervenantOpt = intervenantRepo.findByEmail(email);
        if (intervenantOpt.isPresent()) {
            Intervenant i = intervenantOpt.get();
            if (passwordEncoder.matches(password, i.getMotDePasse())) {
                return new LoginResponse(i.getId(), i.getEmail(), "intervenant", "TOKEN_INT_" + i.getId());
            }
        }

        // 3. Test ADMIN (cherche par Login)
        var adminOpt = adminRepo.findByLogin(email);
        if (adminOpt.isPresent()) {
            Administrator adm = adminOpt.get();
            if (passwordEncoder.matches(password, adm.getMotDePasse())) {
                return new LoginResponse(adm.getId(), adm.getLogin(), "admin", "TOKEN_ADM_" + adm.getId());
            }
        }

        throw new RuntimeException("Identifiants invalides");
    }
}