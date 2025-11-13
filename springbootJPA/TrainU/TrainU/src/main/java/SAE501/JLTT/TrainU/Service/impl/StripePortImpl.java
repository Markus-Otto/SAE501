package SAE501.JLTT.TrainU.Service.impl;

import SAE501.JLTT.TrainU.Service.StripePort;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class StripePortImpl implements StripePort {

    // Clé secrète Stripe lue depuis application.properties
    @Value("${stripe.secret-key}")
    private String secretKey;

    // Au démarrage du bean, initialisation la clé Stripe pour le SDK
    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    /**
     * Crée PaymentIntent côté Stripe.
     * - amountCent : montant en centime
     * - currency   : "eur"
     * - email      : pour l’email du reçu (Stripe enverra un reçu test)
     * - metadata   : info métier (paiementId, apprenantId, …) visible dans le dashboard
     * - idemKey    : clé d’“idempotency” pour éviter un double débit si le POST est rejoué
     *
     * Retour : "pi_xxx:client_secret_xxx"
     */
    @Override
    public String createPaymentIntent(int amountCent, String currency, String email,
                                      Map<String, String> metadata, String idemKey) {
        try {
            // Construction des paramètres du PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) amountCent)
                    .setCurrency(currency)
                    // En test : on force une carte test et la confirmation immédiate
                    .setPaymentMethod("pm_card_visa")
                    .setConfirm(true)
                    .setReceiptEmail(email)
                    // Active les "Automatic Payment Methods" mais interdit toute redirection
                    // => pas besoin de return_url pour Bancontact/Ideal etc. pendant nos tests API
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .setAllowRedirects(PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER)
                                    .build()
                    )
                    .putAllMetadata(metadata)
                    .build();

            // Options d’appel : on met une clé d’idempotence
            var options = com.stripe.net.RequestOptions.builder()
                    .setIdempotencyKey(idemKey)
                    .build();

            // Appel Stripe : création réelle du PaymentIntent
            PaymentIntent pi = PaymentIntent.create(params, options);

            // On renvoie l’ID + le client_secret (utile côté front quand on aura un vrai flow)
            return pi.getId() + ":" + pi.getClientSecret();
        } catch (Exception e) {
            // On re-wrappe l’erreur Stripe dans une RuntimeException claire
            throw new RuntimeException("Erreur Stripe: " + e.getMessage(), e);
        }
    }

    /**
     * Annule un PaymentIntent (utile si on veut “rollback” un paiement non capturé, etc.).
     */
    @Override
    public void cancelPaymentIntent(String paymentIntentId) {
        try {
            PaymentIntent pi = PaymentIntent.retrieve(paymentIntentId);
            pi.cancel();
        } catch (Exception e) {
            throw new RuntimeException("Annulation Stripe échouée: " + e.getMessage(), e);
        }
    }

    /**
     * Crée un remboursement Stripe à partir d’un PaymentIntent.
     * - amountCent null => remboursement total
     * - metadata   => logique métier (motif, notes internes, …)
     *
     * Retour : "re_xxx:status"
     */
    @Override
    public String createRefundByPaymentIntent(String paymentIntentId, Integer amountCent,
                                              Map<String, String> metadata) {
        try {
            // Builder Stripe pour Refund
            RefundCreateParams.Builder b = RefundCreateParams.builder()
                    .setPaymentIntent(paymentIntentId);

            // Si on fournit un montant, Stripe fera un refund partiel
            if (amountCent != null) b.setAmount(amountCent.longValue());

            // Ajout des métadonnées métier
            metadata.forEach(b::putMetadata);

            // Appel Stripe : création du remboursement
            Refund refund = Refund.create(b.build());

            // On retourne l’ID Stripe du refund + son statut (succeeded/pending/failed)
            return refund.getId() + ":" + refund.getStatus();
        } catch (Exception e) {
            throw new RuntimeException("Erreur remboursement Stripe: " + e.getMessage(), e);
        }
    }
}
