package SAE501.JLTT.TrainU.Model;

public enum PaiementStatut {
    CREATED,    // intent créé, pas encore payé
    PAID,       // payé (succeeded)
    REFUNDED,   // remboursé (total)
    FAILED,     // refusé (ex: requires_payment_method après echec)
    PENDING,    // en traitement Stripe (processing) ou 3DS en cours
    CANCELED,   // annulé manuellement côté app
    EXPIRED     // expiré automatiquement (ex: > 14 j)
}
