package SAE501.JLTT.TrainU.Service;

import SAE501.JLTT.TrainU.Controller.dto.*;

import java.util.List;

public interface PaiementService {
    CreatePaymentResponse createPayment(CreatePaymentRequest request);

    PaiementDetails syncStatus(Long paiementId);

    RefundResponse refund(Long paiementId, RefundRequest request);

    List<PaiementListItem> list();

    PaiementDetails details(Long id);

    PaiementDetails cancel(Long paiementId);
    List<PaiementListItem> getByApprenantId(Integer idApprenant);

}
