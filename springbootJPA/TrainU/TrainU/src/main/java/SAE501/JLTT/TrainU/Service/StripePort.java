package SAE501.JLTT.TrainU.Service;

import com.stripe.model.PaymentIntent;

import java.util.Map;

public interface StripePort {
    String createPaymentIntent(int amountCent, String currency, String email,
                               Map<String, String> metadata, String idemKey);

    String createRefundByPaymentIntent(String paymentIntentId, Integer amountCent,
                                       Map<String, String> metadata);

    //  Ajout : lecture de l’état Stripe pour /sync
    PaymentIntent retrievePaymentIntent(String paymentIntentId);
    void cancelPaymentIntent(String paymentIntentId);




}
