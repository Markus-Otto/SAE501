package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Model.Session;
import SAE501.JLTT.TrainU.Service.SessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/session")
@CrossOrigin(origins = "*") // Permet d'éviter les erreurs CORS avec React
public class SessionController {

    private final SessionService service;

    public SessionController(SessionService service) {
        this.service = service;
    }

    // Récupérer toutes les sessions
    @GetMapping
    public List<Session> getAll() {
        return service.getAll();
    }

    // Récupérer UNE session par son ID propre
    @GetMapping("/{id}")
    public Session getOne(@PathVariable Integer id) {
        return service.getById(id);
    }

    // RÉCUPÉRER LES SESSIONS D'UNE FORMATION (Utilisé par React)
    @GetMapping("/formation/{idFormation}/sessions")
    public List<Session> getSessionsByFormation(@PathVariable Integer idFormation) {
        return service.getByFormationId(idFormation);
    }

    @PostMapping("/{idFormation}")
    public Session create(@RequestBody Session s, @PathVariable Integer idFormation) {
        return service.create(s, idFormation);
    }

    @PutMapping("/{id}")
    public Session update(@PathVariable Integer id, @RequestBody Session s) {
        return service.update(id, s);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}