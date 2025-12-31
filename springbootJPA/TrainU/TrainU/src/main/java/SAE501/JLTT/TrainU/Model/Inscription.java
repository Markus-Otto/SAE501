package SAE501.JLTT.TrainU.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JoinColumn(name = "apprenant_id")
    @JsonIgnore // 👈 Empêche de repartir vers l'apprenant en boucle
    private Apprenant apprenant;

    @ManyToOne
    @JoinColumn(name = "session_id")
    @JsonIgnore // 👈 Empêche de repartir vers la session
    private Session session;

    public Inscription() {}
}
