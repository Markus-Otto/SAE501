package SAE501.JLTT.TrainU.Model;

/** Statut "métier" d'un paiement. */
public enum PaiementStatut {
    CREATED,              // créé dans ta BD, pas encore payé/confirmé
    PAID,                 // payé (succeeded)
    PARTIALLY_REFUNDED,   // remboursé partiellement
    REFUNDED,             // remboursé totalement
    CANCELED,             // annulé (PI annulé)
    FAILED                // échec Stripe
}
