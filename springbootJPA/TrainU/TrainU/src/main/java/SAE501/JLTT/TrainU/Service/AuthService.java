package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Controller.dto.LoginRequest;
import SAE501.JLTT.TrainU.Controller.dto.LoginResponse;
import SAE501.JLTT.TrainU.Model.Apprenant;
import SAE501.JLTT.TrainU.Repository.ApprenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class AuthService {

    private final ApprenantRepository apprenantRepo;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest req) {
        // 1. Chercher l'utilisateur par email
        Apprenant apprenant = apprenantRepo.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("Identifiants invalides"));

        // 2. Vérifier le mot de passe avec BCrypt
        if (!passwordEncoder.matches(req.password(), apprenant.getMotDePasse())) {
            throw new RuntimeException("Identifiants invalides");
        }

        // 3. Vérifier si le compte est actif
        if (!apprenant.getActive()) {
            throw new RuntimeException("Compte désactivé");
        }

        // 4. Générer un token (pour l'instant, un faux token simple)
        String token = "FAKE_" + apprenant.getId() + "_TOKEN";

        // 5. Renvoyer la réponse
        return new LoginResponse(

                apprenant.getId(),
                apprenant.getEmail(),
                "USER",  // Pour l'instant, tous les apprenants sont "USER"
                token

        );

    }

}