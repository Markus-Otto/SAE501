package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Controller.dto.*;
import SAE501.JLTT.TrainU.Service.PaiementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaiementController {

    private final PaiementService paiementService;

    @PostMapping
    public CreatePaymentResponse create(@Valid @RequestBody CreatePaymentRequest req) {
        return paiementService.createPayment(req);
    }

    // ✅ CORRECTION : Récupération des paiements
    @GetMapping("/apprenant/{idApprenant}")
    public List<PaiementListItem> getByApprenant(@PathVariable Integer idApprenant) {
        return paiementService.getByApprenantId(idApprenant);
    }

    @PostMapping("/{id}/refunds")
    public RefundResponse refund(@PathVariable Long id, @RequestBody RefundRequest req) {
        return paiementService.refund(id, req);
    }

    @GetMapping
    public List<PaiementListItem> list() { return paiementService.list(); }

    @GetMapping("/{id}")
    public PaiementDetails details(@PathVariable Long id) { return paiementService.details(id); }

    @PostMapping("/{id}/cancel")
    public PaiementDetails cancel(@PathVariable Long id) {
        return paiementService.cancel(id);
    }

    @PostMapping("/{id}/sync")
    public PaiementDetails sync(@PathVariable Long id) {
        return paiementService.syncStatus(id);
    }
}