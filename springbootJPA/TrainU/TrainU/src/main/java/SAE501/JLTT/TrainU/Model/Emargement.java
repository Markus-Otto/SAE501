package SAE501.JLTT.TrainU.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ÉMARGEMENT")
public class Emargement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Boolean present;

    // ✔ lien vers session
    @ManyToOne
    @JoinColumn(name = "ID_SESSION")  // nom dans la base
    private Session session;

    // ✔ lien vers apprenant
    @ManyToOne
    @JoinColumn(name = "ID_APPRENANT")
    private Apprenant apprenant;



}
