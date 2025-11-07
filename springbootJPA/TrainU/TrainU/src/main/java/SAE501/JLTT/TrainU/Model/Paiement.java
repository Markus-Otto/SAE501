package SAE501.JLTT.TrainU.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "paiement")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Paiement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_apprenant", nullable = false)
    private Long apprenantId;

    @Column(name = "montant_total_cent", nullable = false)
    private Integer montantTotalCent;

    @Column(nullable = false, length = 10)
    private String devise; // "eur"

    @Column(name = "stripe_intent_id", unique = true)
    private String stripeIntentId; // null tant qu’on n’a pas parlé à Stripe

    @Column(length = 30, nullable = false)
    private String statut; // CREATED, PAID, etc.

    @Column(name = "date_creation", nullable = false)
    private Instant dateCreation;

    @OneToMany(mappedBy = "paiement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaiementLigne> lignes = new ArrayList<>();
}
