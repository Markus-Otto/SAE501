package SAE501.JLTT.TrainU.Model;

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
    private List<Inscription> inscriptions;

    @OneToMany(mappedBy = "apprenant")
    private List<Emargement> emargements;


    @OneToMany(mappedBy = "apprenant")
    private List<Certificat> certificats;

    public String getRole() {
        return "apprenant";
    }
}