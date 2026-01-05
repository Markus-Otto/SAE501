package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Model.Administrator;
import SAE501.JLTT.TrainU.Model.Apprenant;
import SAE501.JLTT.TrainU.Service.AdministratorService;
import SAE501.JLTT.TrainU.Service.ApprenantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administrator")
@CrossOrigin(origins = {"https://trainu.alwaysdata.net", "http://localhost:5173"})
public class AdministratorController {

    private final AdministratorService administratorService;

    public AdministratorController(AdministratorService administratorService) {
        this.administratorService = administratorService;
    }

    //  Créer un apprenant
    @PostMapping
    public ResponseEntity<Administrator> creerAdministrator(@RequestBody Administrator administrator) {
        Administrator nouveau = administratorService.creerAdministrator(administrator);
        return new ResponseEntity<>(nouveau, HttpStatus.CREATED);
    }

    //  Récupérer tous les apprenants
    @GetMapping
    public ResponseEntity<List<Administrator>> getAllAdministrator() {
        return ResponseEntity.ok(administratorService.getAllAdministrator());
    }

    //  Récupérer un apprenant par ID
    @GetMapping("/{id}")
    public ResponseEntity<Administrator> getAdministratorById(@PathVariable Integer id) {
        return administratorService.getAdministratorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //  Supprimer un apprenant
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerAdministrator(@PathVariable Integer id) {
        administratorService.supprimerAdministrator(id);
        return ResponseEntity.noContent().build();
    }
}
