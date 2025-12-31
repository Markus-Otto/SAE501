package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Model.Emargement;
import SAE501.JLTT.TrainU.Service.EmargementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emargement")
@CrossOrigin(origins = "*") // Nécessaire pour que React puisse communiquer avec Java
public class EmargementController {

    private final EmargementService service;

    public EmargementController(EmargementService service) {
        this.service = service;
    }

    @GetMapping
    public List<Emargement> getAll() {
        return service.getAll();
    }

    // CORRECTION : Utilisation de l'instance "service" et de la bonne méthode
    @GetMapping("/apprenant/{id}")
    public List<Emargement> getByApprenant(@PathVariable Integer id) {
        return service.getByApprenant(id); // 👈 C'était "emargementService" avant
    }

    @PostMapping
    public Emargement create(
            @RequestParam Integer idSession,
            @RequestParam Integer idApprenant,
            @RequestParam Boolean present
    ) {
        return service.create(idSession, idApprenant, present);
    }

    //  Pour récupérer la session
    @GetMapping("/session/{idSession}")
    public List<Emargement> getBySession(@PathVariable Integer idSession) {
        return service.getBySession(idSession);
    }

    // Modifier la session
    @PutMapping("/{id}")
    public Emargement update(@PathVariable Integer id, @RequestParam Boolean present) {
        return service.update(id, present);
    }
}