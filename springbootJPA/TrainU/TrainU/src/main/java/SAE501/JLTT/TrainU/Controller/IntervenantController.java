package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Model.Apprenant;
import SAE501.JLTT.TrainU.Model.Intervenant;
import SAE501.JLTT.TrainU.Service.ApprenantService;
import SAE501.JLTT.TrainU.Service.IntervenantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/intervenants")
public class IntervenantController {

    private final IntervenantService intervenantService;

    public IntervenantController(IntervenantService intervenantService) {
        this.intervenantService = intervenantService;
    }

    //  Créer un apprenant
    @PostMapping
    public ResponseEntity<Intervenant> creerIntervenant(@RequestBody Intervenant intervenant) {
        Intervenant nouveau = intervenantService.creerIntervenant(intervenant);
        return new ResponseEntity<>(nouveau, HttpStatus.CREATED);
    }

    //  Récupérer tous les apprenants
    @GetMapping
    public ResponseEntity<List<Intervenant>> getAllIntervenants() {
        return ResponseEntity.ok(intervenantService.getAllIntervenants());
    }

    //  Récupérer un apprenant par ID
    @GetMapping("/{id}")
    public ResponseEntity<Intervenant> getIntervenantById(@PathVariable Integer id) {
        return intervenantService.getIntervenantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //  Supprimer un apprenant
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delIntervenant(@PathVariable Integer id) {
        intervenantService.delIntervenant(id);
        return ResponseEntity.noContent().build();
    }
}
