package SAE501.JLTT.TrainU.Model;

import SAE501.JLTT.TrainU.Model.Paiement;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "paiement_ligne")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaiementLigne {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "id_paiement", nullable = false)
    private Paiement paiement;

    @Column(name = "id_inscription", nullable = false)
    private Long inscriptionId; // la ligne référence une inscription

    @Column(name = "montant_cent", nullable = false)
    private Integer montantCent;
}
