package SAE501.JLTT.TrainU.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "paiement_ligne")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaiementLigne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Dans PaiementLigne.java

    @ManyToOne
    @JoinColumn(name = "id_inscription")
    @JsonIgnoreProperties("apprenant") // On cache juste l'apprenant pour éviter les boucles
    private Inscription inscription;
    @ManyToOne
    @JoinColumn(name = "id_paiement")
    @JsonIgnore // 👈 Très important : ne pas re-sérialiser le paiement depuis la ligne
    private Paiement paiement;

    @Column(name = "montant_cent")
    private Integer montantCent;
}