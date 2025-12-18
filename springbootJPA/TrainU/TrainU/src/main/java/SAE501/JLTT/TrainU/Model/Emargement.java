package SAE501.JLTT.TrainU.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    // Relation avec Session (À CORRIGER ICI)
    @ManyToOne
    @JoinColumn(name = "id_session")
    private Session session;

    // ✔ lien vers apprenant
    @ManyToOne
    @JoinColumn(name = "ID_APPRENANT")
    private Apprenant apprenant;



}
