package SAE501.JLTT.TrainU.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "`émargement`")
public class Emargement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Boolean present;

    @ManyToOne
    @JoinColumn(name = "id_session")
    @JsonIgnoreProperties({"emargements", "formation", "intervenant"})
    private Session session;

    @ManyToOne
    @JoinColumn(name = "ID_APPRENANT")
    @JsonIgnoreProperties({"inscriptions", "emargements", "certificats", "motDePasse"})
    private Apprenant apprenant;
}