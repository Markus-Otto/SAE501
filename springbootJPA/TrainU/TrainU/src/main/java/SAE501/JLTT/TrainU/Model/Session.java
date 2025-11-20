package SAE501.JLTT.TrainU.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "SESSION")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "TITRE", nullable = false)
    private String Titre;

    @Column(name = "DESCRIPTION", nullable = false)
    private String Description;

    @Column(name = "CATÉGORIE", unique = true)
    private String Categorie;

    @Column(name = "DATE_DEBUT")
    private LocalDateTime dateDebut;

    @Column(name = "DATE_FIN")
    private LocalDateTime dateFin;

    @Column(name = "NOMBRE_PARTICIPANT")
    private Integer nombreParticipants;

    @Column(name = "NOMBRE_POSTE")
    private Integer nombrePoste;

    // ✔ une session appartient à UNE formation
    @ManyToOne
    @JoinColumn(name = "ID_FORMATION", nullable = false)
    private Formation formation;

    // ✔ une session possède plusieurs émargements
    @OneToMany(mappedBy = "session")
    private List<Emargement> emargements;
}