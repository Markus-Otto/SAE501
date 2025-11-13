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
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) amountCent)
                    .setCurrency(currency)
                    // on laisse Stripe choisir le PM via Elements (pas de pm_* en dur)
                    .setReceiptEmail(email)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .setAllowRedirects(
                                            PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER
                                    )
                                    .build()
                    )
                    .putAllMetadata(metadata)
                    .build();

            // idempotency pour éviter les doubles créations
            com.stripe.net.RequestOptions options = com.stripe.net.RequestOptions.builder()
                    .setIdempotencyKey(idemKey)
                    .build();

            PaymentIntent pi = PaymentIntent.create(params, options);
            // on renvoie id + clientSecret (confirm côté front)
            return pi.getId() + ":" + pi.getClientSecret();

        } catch (Exception e) {
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
