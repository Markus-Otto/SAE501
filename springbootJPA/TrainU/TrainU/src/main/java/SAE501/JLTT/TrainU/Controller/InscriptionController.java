package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Model.Inscription;
import SAE501.JLTT.TrainU.Service.InscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionController {

    private final InscriptionService inscriptionService;

    // Injection de dépendance du Service
    public InscriptionController(InscriptionService inscriptionService) {
        this.inscriptionService = inscriptionService;
    }

    // Endpoint pour créer une nouvelle inscription (méthode POST)
    @PostMapping
    public ResponseEntity<Inscription> creerNouvelleInscription(@RequestBody Inscription inscription) {
        Inscription nouvelleInscription = inscriptionService.creerInscription(inscription);
        // Réponse HTTP 201 CREATED
        return new ResponseEntity<>(nouvelleInscription, HttpStatus.CREATED);
    }

    // Endpoint pour récupérer toutes les inscriptions (méthode GET)
    @GetMapping
    public ResponseEntity<List<Inscription>> getAllInscriptions() {
        List<Inscription> inscriptions = inscriptionService.getAllInscriptions();
        return ResponseEntity.ok(inscriptions);
    }

    // Endpoint pour récupérer une inscription par ID (méthode GET)
    @GetMapping("/{id}")
    public ResponseEntity<Inscription> getInscriptionById(@PathVariable Integer id) {
        return inscriptionService.getInscriptionById(id)
                .map(ResponseEntity::ok) // Si trouvée (HTTP 200 OK)
                .orElseGet(() -> ResponseEntity.notFound().build()); // Si non trouvée (HTTP 404 NOT FOUND)
    }
}