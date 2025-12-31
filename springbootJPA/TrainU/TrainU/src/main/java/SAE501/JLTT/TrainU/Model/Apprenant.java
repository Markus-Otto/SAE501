package SAE501.JLTT.TrainU.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "APPRENANT")
public class Apprenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "NOM", nullable = false)
    private String nom;

    @Column(name = "PRENOM", nullable = false)
    private String prenom;

    @Column(name = "EMAIL", unique = true)
    private String email;

    @Column(name = "TELEPHONE")
    private String telephone;

    @Column(name = "MOT_DE_PASSE")
    private String motDePasse;

    @Column(name = "ACTIVE")
    private Boolean active = true;

    @OneToMany(mappedBy = "apprenant")
    @JsonIgnore // 👈 Indispensable pour éviter que l'apprenant ne recharge toutes ses inscriptions/paiements en boucle
    private List<Inscription> inscriptions;

    @OneToMany(mappedBy = "apprenantId") // ou le nom de votre relation vers Paiement
    @JsonIgnore
    private List<Paiement> paiements;

    @OneToMany(mappedBy = "apprenant")
    @JsonIgnore
    private List<Emargement> emargements;


    @OneToMany(mappedBy = "apprenant")
    @JsonIgnore
    private List<Certificat> certificats;

    public String getRole() {
        return "apprenant";
    }
}