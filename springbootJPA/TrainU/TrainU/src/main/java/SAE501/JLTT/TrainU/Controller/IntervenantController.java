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
@CrossOrigin(origins = {"https://trainu.alwaysdata.net", "http://localhost:5173"})
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

    //  Modifier ID (modif profil)
    @PutMapping("/{id}")
    public ResponseEntity<Intervenant> updateIntervenant(@PathVariable Integer id, @RequestBody Intervenant details) {
        Intervenant updated = intervenantService.updateIntervenant(id, details);
        return ResponseEntity.ok(updated);
    }

    //  Supprimer un apprenant
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delIntervenant(@PathVariable Integer id) {
        intervenantService.delIntervenant(id);
        return ResponseEntity.noContent().build();
    }
}
