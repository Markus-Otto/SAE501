package SAE501.JLTT.TrainU.Model;

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

    // ✅ Relation ManyToOne vers Formation (stocke l'ID en BDD)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_FORMATION")
    private Formation formation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_APPRENANT")
    private Apprenant apprenant;

    @Column(name = "Note")
    private Integer note;

    @Column(name = "validation")
    private Boolean validation = false;

    // 🎯 Méthode helper pour récupérer facilement le nom
    @Transient
    public String getNomFormation() {
        return formation != null ? formation.getTitre() : null;
    }

    // 🎯 Méthode helper pour le nom complet de l'apprenant
    @Transient
    public String getNomCompletApprenant() {
        return apprenant != null ?
                apprenant.getPrenom() + " " + apprenant.getNom() : null;
    }

    // Calcul automatique de la validation
    @PrePersist
    @PreUpdate
    public void calculerValidation() {
        if (this.note != null) {
            this.validation = (this.note >= 10);
        }
    }
}
