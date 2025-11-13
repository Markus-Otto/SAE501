package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Controller.dto.CreatePaymentRequest;
import SAE501.JLTT.TrainU.Controller.dto.CreatePaymentResponse;
import SAE501.JLTT.TrainU.Controller.dto.RefundRequest;
import SAE501.JLTT.TrainU.Controller.dto.RefundResponse;

public interface PaiementService {
    CreatePaymentResponse createPayment(CreatePaymentRequest request);
    RefundResponse refund(Long paiementId, RefundRequest request);
}
