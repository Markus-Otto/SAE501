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

        // 🔐 1️⃣ Tentative APPRENANT
        Apprenant apprenant = apprenantRepo.findByEmail(email).orElse(null);
        if (apprenant != null) {
            if (!passwordEncoder.matches(password, apprenant.getMotDePasse())) {
                throw new RuntimeException("Identifiants invalides");
            }

            if (!apprenant.getActive()) {
                throw new RuntimeException("Compte désactivé");
            }

            return new LoginResponse(
                    apprenant.getId(),
                    apprenant.getEmail(),
                    "apprenant",
                    "APPRENANT_" + apprenant.getId() + "_TOKEN"
            );
        }

        // 🔐 2️⃣ Tentative INTERVENANT
        Intervenant intervenant = intervenantRepo.findByEmail(email).orElse(null);
        if (intervenant != null) {
            if (!passwordEncoder.matches(password, intervenant.getMotDePasse())) {
                throw new RuntimeException("Identifiants invalides");
            }

            return new LoginResponse(
                    intervenant.getId(),
                    intervenant.getEmail(),
                    "intervenant",
                    "INTERVENANT_" + intervenant.getId() + "_TOKEN"
            );
        }

        // 🔐 3️⃣ Tentative ADMIN
        Administrator admin = adminRepo.findByLogin(email).orElse(null);
        if (admin != null) {
            if (!passwordEncoder.matches(password, admin.getMotDePasse())) {
                throw new RuntimeException("Identifiants invalides");
            }

            return new LoginResponse(
                    admin.getId(),
                    admin.getLogin(),
                    "admin",
                    "ADMIN_" + admin.getId() + "_TOKEN"
            );
        }


        throw new RuntimeException("Identifiants invalides");
    }
}