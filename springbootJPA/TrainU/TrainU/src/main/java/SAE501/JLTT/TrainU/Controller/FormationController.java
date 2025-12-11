package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Model.Formation;
import SAE501.JLTT.TrainU.Service.FormationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/formation")
public class FormationController {

    private final FormationService service;

    public FormationController(FormationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Formation> getFormations() {
        return service.getAll();
    }

    @GetMapping("/active")
    public List<Formation> getActiveFormations() {
        return service.getActiveFormations();
    }

    @GetMapping("/{id}")
    public Formation getOne(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public Formation create(@RequestBody Formation f) {
        return service.create(f);
    }

    @PutMapping("/{id}")
    public Formation update(@PathVariable Integer id, @RequestBody Formation f) {
        return service.update(id, f);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
