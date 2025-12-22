package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Model.*;
import SAE501.JLTT.TrainU.Repository.*;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CertificatService {

    @Autowired private CertificatRepository certificatRepository;
    @Autowired private FormationRepository formationRepository;
    @Autowired private ApprenantRepository apprenantRepository;

    // ✅ Génération du PDF
    public byte[] genererCertificatPDF(Certificat cert) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitre = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 36);
            Font fontInfo = FontFactory.getFont(FontFactory.HELVETICA, 18);

            Paragraph t = new Paragraph("CERTIFICAT DE RÉUSSITE", fontTitre);
            t.setAlignment(Element.ALIGN_CENTER);
            document.add(t);

            document.add(new Paragraph("\nNom : " + cert.getNomCompletApprenant(), fontInfo));
            document.add(new Paragraph("Formation : " + cert.getNomFormation(), fontInfo));
            document.add(new Paragraph("Note : " + cert.getNote() + "/20", fontInfo));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return out.toByteArray();
    }

    public List<Certificat> getCertificatsByApprenant(Integer idApprenant) {
        return certificatRepository.findByApprenantId(idApprenant);
    }

    public Optional<Certificat> getCertificatById(Integer id) {
        return certificatRepository.findById(id);
    }


    public Certificat creerCertificat(Integer idFormation, Integer idApprenant, Integer note) {
        Formation f = formationRepository.findById(idFormation)
                .orElseThrow(() -> new RuntimeException("Formation introuvable"));
        Apprenant a = apprenantRepository.findById(idApprenant)
                .orElseThrow(() -> new RuntimeException("Apprenant introuvable"));

        Certificat c = new Certificat();
        c.setFormation(f);
        c.setApprenant(a);
        c.setNote(note); // Plus d'erreur ici : Integer = Integer

        // Note : calculerValidation() sera appelé automatiquement par @PrePersist dans ton Model
        return certificatRepository.save(c);
    }

    public List<Certificat> getAllCertificats() { return certificatRepository.findAll(); }
    public void deleteCertificat(Integer id) { certificatRepository.deleteById(id); }
}