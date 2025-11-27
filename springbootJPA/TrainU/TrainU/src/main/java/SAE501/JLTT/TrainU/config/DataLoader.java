package SAE501.JLTT.TrainU.config;

import SAE501.JLTT.TrainU.Model.*;
import SAE501.JLTT.TrainU.Repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final AdministratorRepository administratorRepository;
    private final IntervenantRepository intervenantRepository;
    private final ApprenantRepository apprenantRepository;
    private final FormationRepository formationRepository;
    private final SessionRepository sessionRepository;
    private final InscriptionRepository inscriptionRepository;
    private final EmargementRepository emargementRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        log.info("=== Début du chargement des données de test ===");

        // Mots de passe hashés
        String apprenantPassword = passwordEncoder.encode("apprenant123");
        String intervenantPassword = passwordEncoder.encode("intervenant123");
        String adminPassword = passwordEncoder.encode("admin123");

        // 1. Créer administrateur "admin" si n'existe pas
        if (administratorRepository.findByLogin("admin").isEmpty()) {
            Administrator admin = createAdministrator(adminPassword);
            log.info("✓ Administrateur 'admin' créé");
        } else {
            log.info("→ Administrateur 'admin' existe déjà");
        }

        // 1b. Créer administrateur "superadmin" si n'existe pas
        if (administratorRepository.findByLogin("superadmin").isEmpty()) {
            Administrator adminTest = new Administrator();
            adminTest.setLogin("superadmin");
            adminTest.setMotDePasse(passwordEncoder.encode("SuperPass2024!"));
            administratorRepository.save(adminTest);
            log.info("✓ Administrateur 'superadmin' créé");
        } else {
            log.info("→ Administrateur 'superadmin' existe déjà");
        }

        // 2. Créer 5 intervenants standards
        List<Intervenant> intervenants = createIntervenantsIfNotExist(5, intervenantPassword);
        log.info("✓ {} intervenants standards créés/vérifiés", intervenants.size());

        // 2b. Créer intervenant "marie.dupont@test.com" si n'existe pas
        if (intervenantRepository.findByEmail("marie.dupont@test.com").isEmpty()) {
            Intervenant intervenantTest = new Intervenant();
            intervenantTest.setNom("Dupont");
            intervenantTest.setPrenom("Marie");
            intervenantTest.setEmail("marie.dupont@test.com");
            intervenantTest.setTelephone("0612345678");
            intervenantTest.setMotDePasse(passwordEncoder.encode("MarieSecure2024!"));
            intervenantTest.setActive(true);
            intervenantRepository.save(intervenantTest);
            log.info("✓ Intervenant 'marie.dupont@test.com' créé");
        } else {
            log.info("→ Intervenant 'marie.dupont@test.com' existe déjà");
        }

        // 3. Créer 20 apprenants standards
        List<Apprenant> apprenants = createApprenantsIfNotExist(20, apprenantPassword);
        log.info("✓ {} apprenants standards créés/vérifiés", apprenants.size());

        // 3b. Créer apprenant "lucas.martin@test.com" si n'existe pas
        if (apprenantRepository.findByEmail("lucas.martin@test.com").isEmpty()) {
            Apprenant apprenantTest = new Apprenant();
            apprenantTest.setNom("Martin");
            apprenantTest.setPrenom("Lucas");
            apprenantTest.setEmail("lucas.martin@test.com");
            apprenantTest.setTelephone("0698765432");
            apprenantTest.setMotDePasse(passwordEncoder.encode("LucasPass2024!"));
            apprenantTest.setActive(true);
            apprenantRepository.save(apprenantTest);
            log.info("✓ Apprenant 'lucas.martin@test.com' créé");
        } else {
            log.info("→ Apprenant 'lucas.martin@test.com' existe déjà");
        }

        // 4. Créer 10 formations si elles n'existent pas déjà

        if (formationRepository.count() == 0) {

            List<Formation> formations = createFormations(10);

            log.info("✓ {} formations créées", formations.size());

        } else {

            log.info("→ Formations existent déjà, création ignorée");

        }



        // 5. Créer 15 sessions si elles n'existent pas déjà

        if (sessionRepository.count() == 0) {

            List<Formation> formations = formationRepository.findAll();

            List<Session> sessions = createSessions(15, formations);

            log.info("✓ {} sessions créées", sessions.size());

        } else {

            log.info("→ Sessions existent déjà, création ignorée");

        }



        // 6. Créer des inscriptions si elles n'existent pas déjà

        if (inscriptionRepository.count() == 0) {

            List<Session> sessions = sessionRepository.findAll();

            List<Inscription> inscriptions = createInscriptions(sessions, apprenants);

            log.info("✓ {} inscriptions créées", inscriptions.size());

        } else {

            log.info("→ Inscriptions existent déjà, création ignorée");

        }



        // 7. Créer des émargements si ils n'existent pas déjà

        if (emargementRepository.count() == 0) {

            List<Inscription> inscriptions = inscriptionRepository.findAll();

            List<Emargement> emargements = createEmargements(inscriptions);

            log.info("✓ {} émargements créés", emargements.size());

        } else {

            log.info("→ Émargements existent déjà, création ignorée");

        }

        log.info("=== Fin du chargement des données de test ===");
        log.info("");
        log.info("========== COMPTES DE TEST ==========");
        log.info("");
        log.info("ADMINISTRATEURS:");
        log.info("  1. Login: admin          | Mot de passe: admin123");
        log.info("  2. Login: superadmin     | Mot de passe: SuperPass2024!");
        log.info("");
        log.info("INTERVENANTS:");
        log.info("  - Email: intervenant1..5@test.com | Mot de passe: intervenant123");
        log.info("  - Email: marie.dupont@test.com    | Mot de passe: MarieSecure2024!");
        log.info("");
        log.info("APPRENANTS:");
        log.info("  - Email: apprenant1..20@test.com  | Mot de passe: apprenant123");
        log.info("  - Email: lucas.martin@test.com    | Mot de passe: LucasPass2024!");
        log.info("");
        log.info("=====================================");
    }

    private Administrator createAdministrator(String hashedPassword) {
        Administrator admin = new Administrator();
        admin.setLogin("admin");
        admin.setMotDePasse(hashedPassword);
        return administratorRepository.save(admin);
    }

    private List<Intervenant> createIntervenantsIfNotExist(int count, String hashedPassword) {
        List<Intervenant> intervenants = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            String email = "intervenant" + i + "@test.com";
            var existing = intervenantRepository.findByEmail(email);
            if (existing.isEmpty()) {
                Intervenant intervenant = new Intervenant();
                intervenant.setNom("Nom_Intervenant" + i);
                intervenant.setPrenom("Prenom_Intervenant" + i);
                intervenant.setEmail(email);
                intervenant.setTelephone("060000000" + i);
                intervenant.setMotDePasse(hashedPassword);
                intervenant.setActive(true);
                intervenants.add(intervenantRepository.save(intervenant));
            } else {
                intervenants.add(existing.get());
            }
        }
        return intervenants;
    }

    private List<Apprenant> createApprenantsIfNotExist(int count, String hashedPassword) {
        List<Apprenant> apprenants = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            String email = "apprenant" + i + "@test.com";
            var existing = apprenantRepository.findByEmail(email);
            if (existing.isEmpty()) {
                Apprenant apprenant = new Apprenant();
                apprenant.setNom("Nom_Apprenant" + i);
                apprenant.setPrenom("Prenom_Apprenant" + i);
                apprenant.setEmail(email);
                apprenant.setTelephone("070000000" + (i % 100));
                apprenant.setMotDePasse(hashedPassword);
                apprenant.setActive(true);
                apprenants.add(apprenantRepository.save(apprenant));
            } else {
                apprenants.add(existing.get());
            }
        }
        return apprenants;
    }

    private List<Formation> createFormations(int count) {
        List<Formation> formations = new ArrayList<>();
        String[] categories = {"Développement", "Design", "Management", "Marketing", "Data"};
        String[] titres = {
                "Java Spring Boot",
                "React Avancé",
                "UI/UX Design",
                "Gestion de Projet Agile",
                "Marketing Digital",
                "Python Data Science",
                "Angular Fondamentaux",
                "Leadership",
                "SEO Avancé",
                "Machine Learning"
        };

        for (int i = 0; i < count; i++) {
            Formation formation = new Formation();
            formation.setTitre(titres[i]);
            formation.setDescription("Description de la formation " + titres[i]);
            formation.setCategorie(categories[i % categories.length]);
            formation.setNbHeureTotal(20 + (i * 5));
            formation.setPrix(500 + (i * 100));
            formation.setActive(true);
            formations.add(formationRepository.save(formation));
        }
        return formations;
    }

    private List<Session> createSessions(int count, List<Formation> formations) {
        List<Session> sessions = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = 1; i <= count; i++) {
            Session session = new Session();
            Formation formation = formations.get(i % formations.size());

            session.setTitre("Session " + i + " - " + formation.getTitre());
            session.setDescription("Session de formation pour " + formation.getTitre());
            session.setCategorie("CAT" + i);

            LocalDateTime debut = now.plusDays((i - 5) * 7);
            LocalDateTime fin = debut.plusHours(formation.getNbHeureTotal());

            session.setDateDebut(debut);
            session.setDateFin(fin);
            session.setNombreParticipants(0);
            session.setNombrePoste(10 + random.nextInt(10));
            session.setFormation(formation);

            sessions.add(sessionRepository.save(session));
        }
        return sessions;
    }

    private List<Inscription> createInscriptions(List<Session> sessions, List<Apprenant> apprenants) {
        List<Inscription> inscriptions = new ArrayList<>();
        int apprenantIndex = 0;

        for (Session session : sessions) {
            int nbInscrits = 2 + random.nextInt(4);

            for (int i = 0; i < nbInscrits && apprenantIndex < apprenants.size(); i++) {
                Inscription inscription = new Inscription();
                inscription.setApprenant(apprenants.get(apprenantIndex % apprenants.size()));
                inscription.setSession(session);
                inscription.setPrixCent(session.getFormation().getPrix() * 100);
                inscription.setStatut("CONFIRMEE");
                inscription.setDateInscription(session.getDateDebut().minusDays(14 + random.nextInt(10)));

                inscriptions.add(inscriptionRepository.save(inscription));
                apprenantIndex++;
            }

            session.setNombreParticipants(nbInscrits);
            sessionRepository.save(session);
        }

        return inscriptions;
    }

    private List<Emargement> createEmargements(List<Inscription> inscriptions) {
        List<Emargement> emargements = new ArrayList<>();

        for (Inscription inscription : inscriptions) {
            int nbEmargements = 1 + random.nextInt(3);

            for (int i = 0; i < nbEmargements; i++) {
                Emargement emargement = new Emargement();
                emargement.setApprenant(inscription.getApprenant());
                emargement.setSession(inscription.getSession());

                if (random.nextInt(100) < 20) {
                    emargement.setPresent(false);
                } else {
                    emargement.setPresent(true);
                }

                emargements.add(emargementRepository.save(emargement));
            }
        }

        return emargements;
    }
}
