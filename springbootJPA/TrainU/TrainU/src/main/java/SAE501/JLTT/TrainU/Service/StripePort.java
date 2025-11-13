package SAE501.JLTT.TrainU.Service;

import java.util.Map;

public interface StripePort {
    String createPaymentIntent(int amountCent, String currency, String email,
                               Map<String, String> metadata, String idempotencyKey);

    void cancelPaymentIntent(String paymentIntentId);

    String createRefundByPaymentIntent(String paymentIntentId, Integer amountCent,
                                       Map<String, String> metadata);
}
