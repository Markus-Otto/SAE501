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

    // ✅ Génération du PDF avec design amélioré
    public byte[] genererCertificatPDF(Certificat cert) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate(), 50, 50, 50, 50);
        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Bordure décorative
            document.add(new Paragraph("\n\n"));
            
            // Titre principal
            Font fontTitre = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 48, new java.awt.Color(220, 38, 38));
            Paragraph titre = new Paragraph("CERTIFICAT DE RÉUSSITE", fontTitre);
            titre.setAlignment(Element.ALIGN_CENTER);
            titre.setSpacingAfter(30);
            document.add(titre);

            // Sous-titre
            Font fontSousTitre = FontFactory.getFont(FontFactory.HELVETICA, 16, new java.awt.Color(100, 100, 100));
            Paragraph sousTitre = new Paragraph("Ce certificat atteste que", fontSousTitre);
            sousTitre.setAlignment(Element.ALIGN_CENTER);
            sousTitre.setSpacingAfter(20);
            document.add(sousTitre);

            // Nom de l'apprenant
            Font fontNom = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 32, new java.awt.Color(30, 41, 59));
            Paragraph nom = new Paragraph(cert.getNomCompletApprenant(), fontNom);
            nom.setAlignment(Element.ALIGN_CENTER);
            nom.setSpacingAfter(30);
            document.add(nom);

            // Formation
            Font fontTexte = FontFactory.getFont(FontFactory.HELVETICA, 18, new java.awt.Color(71, 85, 105));
            Paragraph formation = new Paragraph("a suivi avec succès la formation", fontTexte);
            formation.setAlignment(Element.ALIGN_CENTER);
            formation.setSpacingAfter(15);
            document.add(formation);

            Font fontFormation = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, new java.awt.Color(220, 38, 38));
            Paragraph nomFormation = new Paragraph(cert.getNomFormation(), fontFormation);
            nomFormation.setAlignment(Element.ALIGN_CENTER);
            nomFormation.setSpacingAfter(40);
            document.add(nomFormation);

            // Note
            Font fontNote = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, 
                cert.getNote() >= 15 ? new java.awt.Color(34, 197, 94) : new java.awt.Color(59, 130, 246));
            Paragraph note = new Paragraph("Note obtenue : " + cert.getNote() + "/20", fontNote);
            note.setAlignment(Element.ALIGN_CENTER);
            note.setSpacingAfter(50);
            document.add(note);

            // Date
            Font fontDate = FontFactory.getFont(FontFactory.HELVETICA, 14, new java.awt.Color(100, 100, 100));
            Paragraph date = new Paragraph("Délivré le " + new java.text.SimpleDateFormat("dd/MM/yyyy").format(new java.util.Date()), fontDate);
            date.setAlignment(Element.ALIGN_CENTER);
            document.add(date);

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