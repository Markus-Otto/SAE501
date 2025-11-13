package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Controller.dto.*;
import SAE501.JLTT.TrainU.Service.PaiementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaiementController {

    private final PaiementService paiementService;

    // POST /api/payments
    @PostMapping
    public CreatePaymentResponse create(@Valid @RequestBody CreatePaymentRequest req) {
        return paiementService.createPayment(req);
    }

    // POST /api/payments/{id}/refunds
    @PostMapping("/{id}/refunds")
    public RefundResponse refund(@PathVariable Long id, @RequestBody RefundRequest req) {
        return paiementService.refund(id, req);
    }
}
