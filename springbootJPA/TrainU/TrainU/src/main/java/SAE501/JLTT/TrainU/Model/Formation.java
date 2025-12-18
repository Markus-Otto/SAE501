package SAE501.JLTT.TrainU.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@Entity
@Table(name = "FORMATION")
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String titre;

    private String description;

    private String categorie;

    @Column(name = "nb_heure_total")
    private Integer nbHeureTotal;

    private Integer prix;

    private Boolean active;

    // Dans Formation.java
    @OneToMany(mappedBy = "formation")
    private List<Session> sessions;
}
