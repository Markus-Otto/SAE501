package SAE501.JLTT.TrainU.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name= "Inscription")
public class Inscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Colonnes de la table INSCRIPTION (J)
    @Column(name = "PRIX_CENT")
    private Integer prixCent;

    @Setter
    @Column(name = "STATUT")
    private String statut;

    @Setter
    @Column(name = "DATE_INSCRIPTION")
    private LocalDateTime dateInscription;


    @ManyToOne
    @JoinColumn(name = "ID_APPRENANT", nullable = false)
    private Apprenant apprenant;


    //@ManyToOne
   // @JoinColumn(name = "ID_SESSION", nullable = false)
    //private Session session;
    //public Long  getId() {
       // return id;
    public Inscription() {}

}
