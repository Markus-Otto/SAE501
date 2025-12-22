package SAE501.JLTT.TrainU.Model;

import com.fasterxml.jackson.annotation.JsonIgnore; // 👈 AJOUTE CET IMPORT
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
    private Session session;

    // ✅ CORRECTION : Ajout de @JsonIgnore pour stopper la boucle infinie
    @ManyToOne
    @JoinColumn(name = "ID_APPRENANT")
    @JsonIgnore
    private Apprenant apprenant;
}