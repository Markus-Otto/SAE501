package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Model.Inscription;
import SAE501.JLTT.TrainU.Service.InscriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionController {

    private final InscriptionService inscriptionService;

    public InscriptionController(InscriptionService inscriptionService) {
        this.inscriptionService = inscriptionService;
    }

    @PostMapping
    public ResponseEntity<Inscription> creerNouvelleInscription(@RequestBody Inscription inscription) {
        Inscription nouvelleInscription = inscriptionService.creerInscription(inscription);
        return new ResponseEntity<>(nouvelleInscription, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Inscription>> getAllInscriptions() {
        return ResponseEntity.ok(inscriptionService.getAllInscriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscription> getInscriptionById(@PathVariable Integer id) {
        return inscriptionService.getInscriptionById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}