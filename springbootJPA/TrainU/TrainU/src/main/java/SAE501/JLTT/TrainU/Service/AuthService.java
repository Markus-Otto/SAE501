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
        String requestedRole = req.role();

        switch (requestedRole.toLowerCase()) { // Utilisation de toLowerCase pour être robuste
            case "apprenant":
                Apprenant a = apprenantRepo.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Compte Apprenant introuvable"));

                if (!passwordEncoder.matches(password, a.getMotDePasse()))
                    throw new RuntimeException("Mot de passe incorrect");

                if (!a.getActive()) throw new RuntimeException("Compte désactivé");

                // On s'assure que l'ID est converti en Integer si nécessaire
                return new LoginResponse(
                        a.getId().intValue(),
                        a.getEmail(),
                        a.getNom(),
                        a.getPrenom(),
                        "apprenant",
                        "TOKEN_APP_" + a.getId()
                );

            case "intervenant":
                Intervenant i = intervenantRepo.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Compte Intervenant introuvable"));

                if (!passwordEncoder.matches(password, i.getMotDePasse()))
                    throw new RuntimeException("Mot de passe incorrect");

                return new LoginResponse(
                        i.getId().intValue(),
                        i.getEmail(),
                        i.getNom(),
                        i.getPrenom(),
                        "intervenant",
                        "TOKEN_INT_" + i.getId()
                );

            case "admin":
                Administrator adm = adminRepo.findByLogin(email)
                        .orElseThrow(() -> new RuntimeException("Compte Administrateur introuvable"));

                if (!passwordEncoder.matches(password, adm.getMotDePasse()))
                    throw new RuntimeException("Mot de passe incorrect");

                // ✅ Correction : Conversion de l'ID Long vers Integer
                Integer adminId = (adm.getId() != null) ? adm.getId().intValue() : 0;

                return new LoginResponse(
                        adminId,
                        adm.getLogin(),
                        "Admin",
                        "User",
                        "admin",
                        "TOKEN_ADM_" + adm.getId()
                );

            default:
                throw new RuntimeException("Rôle inconnu : " + requestedRole);
        }
    }
}