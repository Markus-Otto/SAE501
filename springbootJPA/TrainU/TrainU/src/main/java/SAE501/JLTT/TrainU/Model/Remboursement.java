package SAE501.JLTT.TrainU.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "remboursement")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Remboursement {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Paiement concerné (obligatoire) */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paiement")
    private Paiement paiement;

    /** Optionnel : si tu veux lier à une ligne précise (sinon laisse null) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paiement_ligne")
    private PaiementLigne ligne;

    /** Montant remboursé en centimes. Null = Stripe a traité un refund total (peu utilisé ici) */
    private Integer montantCent;

    /** Infos métier */
    private String motif;         // ex: "Annulation"
    private String noteInterne;   // visible seulement en back-office

    /** Traces Stripe */
    private String stripeRefundId;       // re_xxx
    private String transactionStripe;    // balance_transaction id

    /** Statut du paiement après ce remboursement (photo au moment T) */
    @Enumerated(EnumType.STRING)
    private PaiementStatut statutAfter;

    @CreationTimestamp
    private Instant dateCreation;
}
