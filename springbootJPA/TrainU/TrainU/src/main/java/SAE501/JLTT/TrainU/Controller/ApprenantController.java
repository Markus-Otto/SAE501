package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Model.Apprenant;
import SAE501.JLTT.TrainU.Service.ApprenantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apprenants")
// ✅ Étape 1 : Autoriser React (CORS)
@CrossOrigin(origins = "http://localhost:5173")
public class ApprenantController {

    private final ApprenantService apprenantService;

    public ApprenantController(ApprenantService apprenantService) {
        this.apprenantService = apprenantService;
    }

    // ✅ Étape 2 : Ajouter la méthode PUT pour la mise à jour
    @PutMapping("/{id}")
    public ResponseEntity<Apprenant> modifierApprenant(@PathVariable Integer id, @RequestBody Apprenant apprenantDetails) {
        try {
            // On demande au service de faire la modification
            Apprenant misAJour = apprenantService.updateApprenant(id, apprenantDetails);
            return ResponseEntity.ok(misAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Apprenant> creerApprenant(@RequestBody Apprenant apprenant) {
        Apprenant nouveau = apprenantService.creerApprenant(apprenant);
        return new ResponseEntity<>(nouveau, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Apprenant>> getAllApprenants() {
        return ResponseEntity.ok(apprenantService.getAllApprenants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Apprenant> getApprenantById(@PathVariable Integer id) {
        return apprenantService.getApprenantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerApprenant(@PathVariable Integer id) {
        apprenantService.supprimerApprenant(id);
        return ResponseEntity.noContent().build();
    }
}