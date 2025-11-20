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

    @Value("${stripe.secret-key}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    @Override
    public String createPaymentIntent(int amountCent, String currency, String email,
                                      Map<String, String> metadata, String idemKey) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) amountCent)
                    .setCurrency(currency)
                    .setReceiptEmail(email)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .setAllowRedirects(PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER)
                                    .build()
                    )
                    .putAllMetadata(metadata)
                    .build();

            var options = com.stripe.net.RequestOptions.builder()
                    .setIdempotencyKey(idemKey)
                    .build();

            PaymentIntent pi = PaymentIntent.create(params, options);
            return pi.getId() + ":" + pi.getClientSecret();
        } catch (Exception e) {
            throw new RuntimeException("Erreur Stripe: " + e.getMessage(), e);
        }
    }

    @Override
    public void cancelPaymentIntent(String paymentIntentId) {
        try {
            PaymentIntent.retrieve(paymentIntentId).cancel();
        } catch (Exception e) {
            throw new RuntimeException("Annulation Stripe échouée: " + e.getMessage(), e);
        }
    }

    @Override
    public String createRefundByPaymentIntent(String paymentIntentId, Integer amountCent,
                                              Map<String, String> metadata) {
        try {
            RefundCreateParams.Builder b = RefundCreateParams.builder()
                    .setPaymentIntent(paymentIntentId);
            if (amountCent != null) b.setAmount(amountCent.longValue());
            metadata.forEach(b::putMetadata);
            Refund refund = Refund.create(b.build());
            return refund.getId() + ":" + refund.getStatus();
        } catch (Exception e) {
            throw new RuntimeException("Erreur remboursement Stripe: " + e.getMessage(), e);
        }
    }

    @Override
    public PaymentIntent retrievePaymentIntent(String paymentIntentId) {
        try {
            return PaymentIntent.retrieve(paymentIntentId);
        } catch (Exception e) {
            throw new RuntimeException("Stripe retrieve PI failed: " + e.getMessage(), e);
        }
    }


}
