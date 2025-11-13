package SAE501.JLTT.TrainU.Service.impl;

import SAE501.JLTT.TrainU.Controller.dto.*;
import SAE501.JLTT.TrainU.Model.Paiement;
import SAE501.JLTT.TrainU.Model.PaiementLigne;
import SAE501.JLTT.TrainU.Repository.PaiementLigneRepository;
import SAE501.JLTT.TrainU.Repository.PaiementRepository;
import SAE501.JLTT.TrainU.Service.PaiementService;
import SAE501.JLTT.TrainU.Service.StripePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import SAE501.JLTT.TrainU.Model.PaiementStatut;
import SAE501.JLTT.TrainU.Model.Remboursement;
import SAE501.JLTT.TrainU.Repository.RemboursementRepository;


import java.time.Instant;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PaiementServiceImpl implements PaiementService {

    private final PaiementRepository paiementRepo;
    private final PaiementLigneRepository ligneRepo;
    private final StripePort stripePort;
    private final RemboursementRepository remboursementRepo;

    @Transactional
    @Override
    public CreatePaymentResponse createPayment(CreatePaymentRequest req) {
        int total = req.lignes().stream().mapToInt(CreatePaymentRequest.Ligne::montantCent).sum();

        // 1) Crée l'entête Paiement
        Paiement p = Paiement.builder()
                .apprenantId(req.apprenantId())
                .montantTotalCent(total)
                .devise("eur")
                .statut(PaiementStatut.CREATED)
                .dateCreation(Instant.now())
                .build();
        paiementRepo.save(p);

        // 2) Crée les lignes
        for (var l : req.lignes()) {
            ligneRepo.save(PaiementLigne.builder()
                    .paiement(p)
                    .inscriptionId(l.inscriptionId())
                    .montantCent(l.montantCent())
                    .build());
        }

        // 3) Appelle Stripe (test: pm_card_visa) + confirmation immédiate
        var metadata = Map.of("paiementId", String.valueOf(p.getId()),
                "apprenantId", String.valueOf(req.apprenantId()));
        String res = stripePort.createPaymentIntent(total, "eur", req.email(), metadata, "pay_" + p.getId());
        String[] parts = res.split(":"); // [0] = pi_xxx, [1] = secret

        // 4) Met à jour l'entête
        p.setStripeIntentId(parts[0]);
        p.setStatut(PaiementStatut.PAID); // en mode test confirm immédiate => succeeded
        paiementRepo.save(p);

        return new CreatePaymentResponse(
                p.getId(),
                parts[0],
                parts[1],
                Integer.valueOf(total),   // <-- box en Integer
                "eur",
                p.getStatut().name()      // <-- enum -> String
        );

    }

    @Transactional
    @Override
    public RefundResponse refund(Long paiementId, RefundRequest req) {
        // 1) Charger le paiement
        var paiement = paiementRepo.findById(paiementId)
                .orElseThrow(() -> new NoSuchElementException("Paiement " + paiementId + " introuvable"));

        if (paiement.getStatut() == PaiementStatut.REFUNDED) {
            throw new IllegalStateException("Paiement déjà remboursé");
        }

        // 2) Montant total (pour l’enregistrer en base – Stripe n’en a pas besoin si refund total)
        int amountTotal = paiement.getMontantTotalCent();

        // 3) Métadonnées (audit dans le dashboard Stripe)
        var meta = new java.util.HashMap<String, String>();
        meta.put("paiementId", String.valueOf(paiementId));
        if (req.motif() != null) meta.put("motif", req.motif());

        // 4) Appel Stripe — FULL REFUND : on passe `null` comme montant pour dire "total"
        String rr = stripePort.createRefundByPaymentIntent(
                paiement.getStripeIntentId(),
                null,    // <-- montant null => remboursement total
                meta
        );
        String[] parts = rr.split(":"); // [0] = re_xxx, [1] = status

        // 5) Mettre à jour le statut du paiement (enum)
        paiement.setStatut(PaiementStatut.REFUNDED);
        paiementRepo.save(paiement);

        // 6) Persister l'objet Remboursement (1 ligne par refund)
        Remboursement r = Remboursement.builder()
                .paiement(paiement)
                .montantCent(amountTotal)             // on garde la trace du montant
                .motif(req.motif())
                .noteInterne(req.noteInterne())
                .stripeRefundId(parts[0])
                .transactionStripe(null)              // tu peux remonter la balance transaction plus tard
                .statutAfter(PaiementStatut.REFUNDED) // photo du statut après refund
                .build();
        remboursementRepo.save(r);

        // 7) Réponse API (si tu as gardé la version 3 champs)
        return new RefundResponse(r.getId(), parts[0], parts[1], paiement.getStatut().name());

    }


}
