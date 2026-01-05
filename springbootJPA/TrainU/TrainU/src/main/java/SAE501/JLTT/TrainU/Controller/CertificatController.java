package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Controller.dto.CertificatDTO;
import SAE501.JLTT.TrainU.Model.Certificat;
import SAE501.JLTT.TrainU.Service.CertificatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificats")
@CrossOrigin(origins = {"https://trainu.alwaysdata.net", "http://localhost:5173"})
public class CertificatController {

    @Autowired
    private CertificatService certificatService;

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadCertificat(@PathVariable Integer id) {
        return certificatService.getCertificatById(id).map(cert -> {
            // Génération du contenu PDF via le service
            byte[] pdfData = certificatService.genererCertificatPDF(cert);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"certificat_" + id + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfData);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/apprenant/{idApprenant}")
    public List<Certificat> getByApprenant(@PathVariable Integer idApprenant) {
        return certificatService.getCertificatsByApprenant(idApprenant);
    }

    @PostMapping
    public Certificat create(@RequestBody CertificatDTO dto) {
        // Suppression de .doubleValue() pour envoyer un Integer
        return certificatService.creerCertificat(
                dto.getIdFormation(),
                dto.getIdApprenant(),
                dto.getNote()
        );
    }

    @GetMapping
    public List<Certificat> getAll() {
        return certificatService.getAllCertificats();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        certificatService.deleteCertificat(id);
        return ResponseEntity.noContent().build();
    }
}