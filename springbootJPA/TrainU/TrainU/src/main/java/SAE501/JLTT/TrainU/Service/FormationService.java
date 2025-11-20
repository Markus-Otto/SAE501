package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Model.Formation;
import SAE501.JLTT.TrainU.Repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormationService {

    private final FormationRepository repository;

    public FormationService(FormationRepository repository) {
        this.repository = repository;
    }

    public List<Formation> getAll() {
        return repository.findAll();
    }

    public Formation getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public Formation create(Formation formation) {
        return repository.save(formation);
    }

    public Formation update(Integer id, Formation formation) {
        formation.setId(id);
        return repository.save(formation);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
