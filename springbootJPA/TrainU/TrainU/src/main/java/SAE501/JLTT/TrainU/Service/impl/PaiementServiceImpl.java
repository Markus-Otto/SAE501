package SAE501.JLTT.TrainU.Service.impl;

import SAE501.JLTT.TrainU.Controller.dto.*;
import SAE501.JLTT.TrainU.Model.Paiement;
import SAE501.JLTT.TrainU.Model.PaiementLigne;
import SAE501.JLTT.TrainU.Model.PaiementStatut;
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

    @Override
    @Transactional(readOnly = true)
    public List<PaiementListItem> getByApprenantId(Integer idApprenant) {
        // ✅ Correction : Conversion explicite de Integer vers Long
        Long idLong = (idApprenant != null) ? idApprenant.longValue() : 0L;

        return paiementRepo.findByApprenantId(idLong)
                .stream()
                .map(this::mapToListItem)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaiementListItem> list() {
        return paiementRepo.findAll(org.springframework.data.domain.Sort.by("id").descending())
                .stream()
                .map(this::mapToListItem)
                .toList();
    }

    private PaiementListItem mapToListItem(Paiement p) {
        // ✅ On s'assure que si le DTO attend un Integer, on convertit le Long du modèle
        Integer apprenantIdFinal = 0;
        if (p.getApprenantId() != null) {
            apprenantIdFinal = p.getApprenantId().intValue();
        }

        return new PaiementListItem(
                p.getId(),
                apprenantIdFinal,
                p.getMontantTotalCent(),
                p.getDevise(),
                p.getStatut(),
                p.getStripeIntentId(),
                p.getDateCreation()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PaiementDetails details(Long id) {
        Paiement p = paiementRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Paiement non trouvé : " + id));

        var lignes = ligneRepo.findByPaiement_Id(p.getId()).stream()
                .map(l -> new PaiementDetails.Ligne(l.getInscriptionId(), l.getMontantCent()))
                .toList();

        Integer apprenantIdFinal = 0;
        if (p.getApprenantId() != null) {
            apprenantIdFinal = p.getApprenantId().intValue();
        }

        return new PaiementDetails(
                p.getId(),
                apprenantIdFinal,
                p.getMontantTotalCent(),
                p.getDevise(),
                p.getStatut(),
                p.getStripeIntentId(),
                p.getDateCreation(),
                lignes);
    }

    @Transactional
    @Override
    public CreatePaymentResponse createPayment(CreatePaymentRequest req) {
        int total = req.lignes().stream().mapToInt(CreatePaymentRequest.Ligne::montantCent).sum();

        // ✅ Correction cruciale : Conversion explicite vers Long
        // On utilise longValue() pour extraire la valeur si req.apprenantId() est un Integer
        Long appId = (req.apprenantId() != null) ? req.apprenantId().longValue() : 0L;

        Paiement p = Paiement.builder()
                .apprenantId(appId)
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
        String[] parts = res.split(":");

        p.setStripeIntentId(parts[0]);
        paiementRepo.save(p);

        return new CreatePaymentResponse(
                p.getId(),
                parts[0],
                parts[1],
                total,
                "eur",
                p.getStatut().name()
        );
    }

    @Override
    @Transactional
    public PaiementDetails syncStatus(Long paiementId) {
        Paiement p = paiementRepo.findById(paiementId).orElseThrow();
        var pi = stripePort.retrievePaymentIntent(p.getStripeIntentId());

        switch (pi.getStatus()) {
            case "succeeded" -> p.setStatut(PaiementStatut.PAID);
            case "processing" -> p.setStatut(PaiementStatut.PENDING);
            case "requires_payment_method" -> p.setStatut(PaiementStatut.FAILED);
            case "requires_action" -> p.setStatut(PaiementStatut.CREATED);
            case "canceled" -> p.setStatut(PaiementStatut.CANCELED);
            default -> p.setStatut(PaiementStatut.CREATED);
        }

        paiementRepo.save(p);
        return details(p.getId());
    }

    @Override
    @Transactional
    public PaiementDetails cancel(Long paiementId) {
        Paiement p = paiementRepo.findById(paiementId).orElseThrow();
        if (p.getStatut() == PaiementStatut.PAID || p.getStatut() == PaiementStatut.REFUNDED) {
            throw new IllegalStateException("Impossible d'annuler un paiement déjà finalisé.");
        }
        if (p.getStripeIntentId() != null) {
            try {
                stripePort.cancelPaymentIntent(p.getStripeIntentId());
            } catch (RuntimeException ignore) {}
        }
        p.setStatut(PaiementStatut.CANCELED);
        paiementRepo.save(p);
        return details(p.getId());
    }

    @Transactional
    @Override
    public RefundResponse refund(Long paiementId, RefundRequest req) {
        Paiement paiement = paiementRepo.findById(paiementId).orElseThrow();
        if (paiement.getStatut() != PaiementStatut.PAID) {
            throw new IllegalStateException("Seuls les paiements 'PAID' peuvent être remboursés.");
        }
        String rr = stripePort.createRefundByPaymentIntent(
                paiement.getStripeIntentId(),
                null,
                Map.of("paiementId", String.valueOf(paiementId))
        );
        String[] parts = rr.split(":");
        paiement.setStatut(PaiementStatut.REFUNDED);
        paiementRepo.save(paiement);
        return new RefundResponse(null, parts[0], parts[1], paiement.getStatut().name());
    }
}