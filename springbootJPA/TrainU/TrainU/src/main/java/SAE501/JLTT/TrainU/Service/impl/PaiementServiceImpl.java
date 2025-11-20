package SAE501.JLTT.TrainU.Service.impl;

import SAE501.JLTT.TrainU.Controller.dto.*;
import SAE501.JLTT.TrainU.Model.Paiement;
import SAE501.JLTT.TrainU.Model.PaiementLigne;
import SAE501.JLTT.TrainU.Model.PaiementStatut;
import SAE501.JLTT.TrainU.Model.Remboursement;
import SAE501.JLTT.TrainU.Repository.PaiementLigneRepository;
import SAE501.JLTT.TrainU.Repository.PaiementRepository;
import SAE501.JLTT.TrainU.Repository.RemboursementRepository;
import SAE501.JLTT.TrainU.Service.PaiementService;
import SAE501.JLTT.TrainU.Service.StripePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PaiementServiceImpl implements PaiementService {

    private final PaiementRepository paiementRepo;
    private final PaiementLigneRepository ligneRepo;
    private final StripePort stripePort;
    private final RemboursementRepository remboursementRepo;

    /** Création : on reste en CREATED et on ne met PAS PAID tout de suite. */
    @Transactional
    @Override
    public CreatePaymentResponse createPayment(CreatePaymentRequest req) {
        int total = req.lignes().stream().mapToInt(CreatePaymentRequest.Ligne::montantCent).sum();

        Paiement p = Paiement.builder()
                .apprenantId(req.apprenantId())
                .montantTotalCent(total)
                .devise("eur")
                .statut(PaiementStatut.CREATED)
                .dateCreation(Instant.now())
                .build();
        paiementRepo.save(p);

        for (var l : req.lignes()) {
            ligneRepo.save(PaiementLigne.builder()
                    .paiement(p)
                    .inscriptionId(l.inscriptionId())
                    .montantCent(l.montantCent())
                    .build());
        }

        var metadata = Map.of(
                "paiementId", String.valueOf(p.getId()),
                "apprenantId", String.valueOf(req.apprenantId())
        );

        String res = stripePort.createPaymentIntent(total, "eur", req.email(), metadata, "pay_" + p.getId());
        String[] parts = res.split(":"); // 0=pi_xxx, 1=clientSecret

        p.setStripeIntentId(parts[0]); // on n’active pas PAID ici
        paiementRepo.save(p);

        return new CreatePaymentResponse(
                p.getId(), parts[0], parts[1],
                Integer.valueOf(total), "eur", p.getStatut().name()
        );
    }

    /** Refund total uniquement (simplifié). */
    @Transactional
    @Override
    public RefundResponse refund(Long paiementId, RefundRequest req) {
        var paiement = paiementRepo.findById(paiementId)
                .orElseThrow(() -> new NoSuchElementException("Paiement " + paiementId + " introuvable"));

        if (paiement.getStatut() == PaiementStatut.REFUNDED) {
            throw new IllegalStateException("Paiement déjà remboursé");
        }

        int amountTotal = paiement.getMontantTotalCent();

        var meta = new java.util.HashMap<String, String>();
        meta.put("paiementId", String.valueOf(paiementId));
        if (req.motif() != null) meta.put("motif", req.motif());

        String rr = stripePort.createRefundByPaymentIntent(
                paiement.getStripeIntentId(), null, meta // null => full refund
        );
        String[] parts = rr.split(":"); // 0=re_xxx, 1=status

        paiement.setStatut(PaiementStatut.REFUNDED);
        paiementRepo.save(paiement);

        Remboursement r = Remboursement.builder()
                .paiement(paiement)
                .montantCent(amountTotal)
                .motif(req.motif())
                .noteInterne(req.noteInterne())
                .stripeRefundId(parts[0])
                .transactionStripe(null)
                .statutAfter(PaiementStatut.REFUNDED)
                .build();
        remboursementRepo.save(r);

        return new RefundResponse(r.getId(), parts[0], parts[1], paiement.getStatut().name());
    }

    @Override
    public List<PaiementListItem> list() {
        return paiementRepo.findAll(org.springframework.data.domain.Sort.by("id").descending())
                .stream()
                .map(p -> new PaiementListItem(
                        p.getId(), p.getApprenantId(), p.getMontantTotalCent(),
                        p.getDevise(), p.getStatut(), p.getStripeIntentId(), p.getDateCreation()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PaiementDetails details(Long id) {
        var p = paiementRepo.findById(id).orElseThrow();
        var lignes = ligneRepo.findByPaiement_Id(p.getId()).stream()
                .map(l -> new PaiementDetails.Ligne(l.getInscriptionId(), l.getMontantCent()))
                .toList();
        return new PaiementDetails(
                p.getId(), p.getApprenantId(), p.getMontantTotalCent(),
                p.getDevise(), p.getStatut(), p.getStripeIntentId(), p.getDateCreation(), lignes);
    }

    /** /sync : interroge Stripe et met à jour le statut local. */
    @Transactional
    @Override
    public PaiementDetails syncStatus(Long paiementId) {
        var p = paiementRepo.findById(paiementId)
                .orElseThrow(() -> new NoSuchElementException("Paiement " + paiementId + " introuvable"));

        var pi = stripePort.retrievePaymentIntent(p.getStripeIntentId());
        String st = pi.getStatus(); // "succeeded", "processing", "requires_payment_method", "requires_action", ...

        switch (st) {
            case "succeeded" -> p.setStatut(PaiementStatut.PAID);
            case "processing" -> p.setStatut(PaiementStatut.PENDING);
            case "requires_payment_method" -> p.setStatut(PaiementStatut.FAILED);
            case "requires_action" -> p.setStatut(PaiementStatut.CREATED);
            default -> p.setStatut(PaiementStatut.CREATED);
        }
        paiementRepo.save(p);

        var lignes = ligneRepo.findByPaiement_Id(p.getId()).stream()
                .map(l -> new PaiementDetails.Ligne(l.getInscriptionId(), l.getMontantCent()))
                .toList();
        return new PaiementDetails(
                p.getId(), p.getApprenantId(), p.getMontantTotalCent(),
                p.getDevise(), p.getStatut(), p.getStripeIntentId(), p.getDateCreation(), lignes);
    }

    public void cancelPaymentIntent(String paymentIntentId) {
        try {
            com.stripe.model.PaymentIntent.retrieve(paymentIntentId).cancel();
        } catch (Exception e) {
            throw new RuntimeException("Stripe cancel PI failed: " + e.getMessage(), e);
        }
    }


    @Override
    @org.springframework.transaction.annotation.Transactional
    public PaiementDetails cancel(Long paiementId) {
        var p = paiementRepo.findById(paiementId).orElseThrow();

        // si déjà finalisé on refuse l’annulation
        if (p.getStatut() == PaiementStatut.PAID || p.getStatut() == PaiementStatut.REFUNDED) {
            throw new IllegalStateException("Paiement déjà finalisé");
        }

        // annuler l'Intent côté Stripe si possible
        if (p.getStripeIntentId() != null) {
            try {
                stripePort.cancelPaymentIntent(p.getStripeIntentId());
            } catch (RuntimeException ignore) {
                // on évite de bloquer si Stripe renvoie déjà 'canceled' etc.
            }
        }

        p.setStatut(PaiementStatut.CANCELED);
        paiementRepo.save(p);

        return details(p.getId());
    }

}
