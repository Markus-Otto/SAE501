package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Model.Inscription;
import SAE501.JLTT.TrainU.Repository.InscriptionRepository;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InscriptionService {

    private final InscriptionRepository inscriptionRepository;

    // Injection de dépendance du Repository via le constructeur
    public InscriptionService(InscriptionRepository inscriptionRepository) {
        this.inscriptionRepository = inscriptionRepository;
    }

    /**
     * Crée une nouvelle inscription.
     * @param inscription L'objet Inscription à sauvegarder.
     * @return L'inscription sauvegardée (avec l'ID généré).
     */
    public Inscription creerInscription(Inscription inscription) {
        // Logique métier : définir la date d'inscription juste avant de sauvegarder
        inscription.setDateInscription(LocalDateTime.now());

        // Logique métier : s'assurer qu'un statut par défaut est défini si non fourni
        if (inscription.getStatut() == null || inscription.getStatut().isEmpty()) {
            inscription.setStatut("EN_ATTENTE");
        }

        // Sauvegarde via le Repository
        return inscriptionRepository.save(inscription);
    }

    /**
     * Récupère une inscription par son ID.
     */
    public Optional<Inscription> getInscriptionById(Integer id) {
        return inscriptionRepository.findById(id);
    }

    /**
     * Récupère toutes les inscriptions.
     */
    public List<Inscription> getAllInscriptions() {
        return inscriptionRepository.findAll();
    }

    // Pour désínscrire un utilisateur d'une session
    public void deleteInscription(Integer id) {
        inscriptionRepository.deleteById(id);
    }
}