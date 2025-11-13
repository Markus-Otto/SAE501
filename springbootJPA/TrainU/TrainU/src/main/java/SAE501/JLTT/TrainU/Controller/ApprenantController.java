package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Model.Apprenant;
import SAE501.JLTT.TrainU.Service.ApprenantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apprenants")
public class ApprenantController {

    private final ApprenantService apprenantService;

    public ApprenantController(ApprenantService apprenantService) {
        this.apprenantService = apprenantService;
    }

    //  Créer un apprenant
    @PostMapping
    public ResponseEntity<Apprenant> creerApprenant(@RequestBody Apprenant apprenant) {
        Apprenant nouveau = apprenantService.creerApprenant(apprenant);
        return new ResponseEntity<>(nouveau, HttpStatus.CREATED);
    }

    //  Récupérer tous les apprenants
    @GetMapping
    public ResponseEntity<List<Apprenant>> getAllApprenants() {
        return ResponseEntity.ok(apprenantService.getAllApprenants());
    }

    //  Récupérer un apprenant par ID
    @GetMapping("/{id}")
    public ResponseEntity<Apprenant> getApprenantById(@PathVariable Integer id) {
        return apprenantService.getApprenantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //  Supprimer un apprenant
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerApprenant(@PathVariable Integer id) {
        apprenantService.supprimerApprenant(id);
        return ResponseEntity.noContent().build();
    }
}
