package SAE501.JLTT.TrainU.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


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
}
