package SAE501.JLTT.TrainU.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "INSCRIPTION")
public class Inscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "PRIX_CENT")
    private Integer prixCent;

    @Column(name = "STATUT")
    private String statut;

    @Column(name = "DATE_INSCRIPTION")
    private LocalDateTime dateInscription;

    @ManyToOne
    @JoinColumn(name = "ID_APPRENANT", nullable = false)
    @JsonIgnoreProperties({"inscriptions", "emargements", "certificats", "motDePasse"})
    private Apprenant apprenant;

    @ManyToOne
    @JoinColumn(name = "ID_SESSION", nullable = false)
    @JsonIgnoreProperties({"emargements", "formation"})
    private Session session;

    public Inscription() {}
}
