package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Controller.dto.CertificatDTO;
import SAE501.JLTT.TrainU.Model.Certificat;
import SAE501.JLTT.TrainU.Service.CertificatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificats")
@CrossOrigin(origins = "*")
public class CertificatController {

    @Autowired
    private CertificatService certificatService;

    @GetMapping
    public List<Certificat> getAll() {
        return certificatService.getAllCertificats();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certificat> getById(@PathVariable Integer id) {
        return certificatService.getCertificatById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Certificat create(@RequestBody CertificatDTO dto) {
        return certificatService.creerCertificat(
                dto.getIdFormation(),
                dto.getIdApprenant(),
                dto.getNote()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Certificat> update(
            @PathVariable Integer id,
            @RequestBody CertificatDTO dto) {
        try {
            Certificat updated = certificatService.updateCertificat(
                    id,
                    dto.getIdFormation(),
                    dto.getIdApprenant(),
                    dto.getNote()
            );
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            certificatService.deleteCertificat(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/apprenant/{idApprenant}")
    public List<Certificat> getByApprenant(@PathVariable Integer idApprenant) {
        return certificatService.getCertificatsByApprenant(idApprenant);
    }

    @GetMapping("/formation/{idFormation}")
    public List<Certificat> getByFormation(@PathVariable Integer idFormation) {
        return certificatService.getCertificatsByFormation(idFormation);
    }

    @GetMapping("/valides")
    public List<Certificat> getValides() {
        return certificatService.getCertificatsValides();
    }
}