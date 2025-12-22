package SAE501.JLTT.TrainU.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "CERTIFICAT")
public class Certificat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "Note")
    private Integer note;

    @Column(name = "validation")
    private Boolean validation = false;

    // ✅ CORRECTION 1 : On garde une seule déclaration pour Formation.
    // On ne met PAS @JsonIgnore ici, car ton Dashboard React a besoin de
    // lire "certificat.formation.titre".
    @ManyToOne
    @JoinColumn(name = "ID_FORMATION")
    private Formation formation;

    // ✅ CORRECTION 2 : On garde une seule déclaration pour Apprenant.
    // On AJOUTE @JsonIgnore pour empêcher la boucle infinie (Apprenant -> Certif -> Apprenant...)
    @ManyToOne
    @JoinColumn(name = "ID_APPRENANT")
    @JsonIgnore
    private Apprenant apprenant;

    // 🎯 Méthode helper pour récupérer facilement le nom (Optionnel mais pratique)
    @Transient
    public String getNomFormation() {
        return formation != null ? formation.getTitre() : null;
    }

    // 🎯 Méthode helper pour le nom complet de l'apprenant (Optionnel)
    @Transient
    public String getNomCompletApprenant() {
        return apprenant != null ?
                apprenant.getPrenom() + " " + apprenant.getNom() : null;
    }

    // Calcul automatique de la validation avant sauvegarde
    @PrePersist
    @PreUpdate
    public void calculerValidation() {
        if (this.note != null) {
            this.validation = (this.note >= 10);
        }
    }
}