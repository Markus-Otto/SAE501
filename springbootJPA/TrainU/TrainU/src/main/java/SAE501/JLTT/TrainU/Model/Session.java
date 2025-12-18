package SAE501.JLTT.TrainU.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@Entity
@Table(name = "SESSION")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String titre;
    private String description;
    private String categorie;

    @Column(name = "DATE_DEBUT")
    private LocalDateTime dateDebut;

    @Column(name = "DATE_FIN")
    private LocalDateTime dateFin;

    @Column(name = "NOMBRE_PARTICIPANT")
    private Integer nombreParticipants;

    @Column(name = "NOMBRE_POSTE")
    private Integer nombrePoste;

    @ManyToOne
    @JoinColumn(name = "ID_FORMATION", nullable = false)
    @JsonIgnoreProperties("sessions")
    private Formation formation;

    @JsonIgnore
    @OneToMany(mappedBy = "session")
    private List<Emargement> emargements;

}