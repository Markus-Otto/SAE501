package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Model.Certificat;
import SAE501.JLTT.TrainU.Model.Formation;
import SAE501.JLTT.TrainU.Model.Apprenant;
import SAE501.JLTT.TrainU.Repository.CertificatRepository;
import SAE501.JLTT.TrainU.Repository.FormationRepository;
import SAE501.JLTT.TrainU.Repository.ApprenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CertificatService {

    @Autowired
    private CertificatRepository certificatRepository;

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private ApprenantRepository apprenantRepository;

    /**
     * Récupérer tous les certificats
     */
    public List<Certificat> getAllCertificats() {
        return certificatRepository.findAll();
    }

    /**
     * Récupérer un certificat par son ID
     */
    public Optional<Certificat> getCertificatById(Integer id) {
        return certificatRepository.findById(id);
    }

    /**
     * Créer un nouveau certificat
     */
    public Certificat creerCertificat(Integer idFormation, Integer idApprenant, Integer note) {
        // Vérifier que la formation existe
        Formation formation = formationRepository.findById(idFormation)
                .orElseThrow(() -> new RuntimeException("Formation introuvable avec l'ID : " + idFormation));

        // Vérifier que l'apprenant existe
        Apprenant apprenant = apprenantRepository.findById(idApprenant)
                .orElseThrow(() -> new RuntimeException("Apprenant introuvable avec l'ID : " + idApprenant));

        // Créer le certificat
        Certificat certificat = new Certificat();
        certificat.setFormation(formation);
        certificat.setApprenant(apprenant);
        certificat.setNote(note);
        // La validation sera calculée automatiquement via @PrePersist

        return certificatRepository.save(certificat);
    }

    /**
     * Mettre à jour un certificat existant
     */
    public Certificat updateCertificat(Integer id, Integer idFormation, Integer idApprenant, Integer note) {
        Certificat certificat = certificatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificat introuvable avec l'ID : " + id));

        // Mettre à jour la formation si fournie
        if (idFormation != null) {
            Formation formation = formationRepository.findById(idFormation)
                    .orElseThrow(() -> new RuntimeException("Formation introuvable avec l'ID : " + idFormation));
            certificat.setFormation(formation);
        }

        // Mettre à jour l'apprenant si fourni
        if (idApprenant != null) {
            Apprenant apprenant = apprenantRepository.findById(idApprenant)
                    .orElseThrow(() -> new RuntimeException("Apprenant introuvable avec l'ID : " + idApprenant));
            certificat.setApprenant(apprenant);
        }

        // Mettre à jour la note si fournie
        if (note != null) {
            certificat.setNote(note);
        }
        // La validation sera recalculée automatiquement via @PreUpdate

        return certificatRepository.save(certificat);
    }

    /**
     * Supprimer un certificat
     */
    public void deleteCertificat(Integer id) {
        if (!certificatRepository.existsById(id)) {
            throw new RuntimeException("Certificat introuvable avec l'ID : " + id);
        }
        certificatRepository.deleteById(id);
    }

    /**
     * Récupérer tous les certificats d'un apprenant
     */
    public List<Certificat> getCertificatsByApprenant(Integer idApprenant) {
        return certificatRepository.findByApprenantId(idApprenant);
    }

    /**
     * Récupérer tous les certificats pour une formation
     */
    public List<Certificat> getCertificatsByFormation(Integer idFormation) {
        return certificatRepository.findByFormationId(idFormation);
    }

    /**
     * Récupérer uniquement les certificats validés (note >= 10)
     */
    public List<Certificat> getCertificatsValides() {
        return certificatRepository.findByValidationTrue();
    }

    /**
     * Récupérer les certificats non validés
     */
    public List<Certificat> getCertificatsNonValides() {
        return certificatRepository.findByValidationFalse();
    }

    /**
     * Vérifier si un apprenant a déjà un certificat pour une formation
     */
    public boolean apprenantPossedeCertificat(Integer idApprenant, Integer idFormation) {
        return certificatRepository.existsByApprenantIdAndFormationId(idApprenant, idFormation);
    }

    /**
     * Compter le nombre de certificats validés pour un apprenant
     */
    public long countCertificatsValidesByApprenant(Integer idApprenant) {
        return certificatRepository.countByApprenantIdAndValidationTrue(idApprenant);
    }
}