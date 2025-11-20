package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Model.Emargement;
import SAE501.JLTT.TrainU.Service.EmargementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emargement")
public class EmargementController {

    private final EmargementService service;

    public EmargementController(EmargementService service) {
        this.service = service;
    }

    @GetMapping
    public List<Emargement> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Emargement create(
            @RequestParam Integer idSession,
            @RequestParam Integer idApprenant,
            @RequestParam Boolean present
    ) {
        return service.create(idSession, idApprenant, present);
    }
}
