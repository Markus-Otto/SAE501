package SAE501.JLTT.TrainU.config;

import SAE501.JLTT.TrainU.Model.PaiementStatut;
import SAE501.JLTT.TrainU.Repository.PaiementRepository;
import SAE501.JLTT.TrainU.Service.StripePort;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class PaymentMaintenance {

    private final PaiementRepository paiementRepo;
    private final StripePort stripePort;

    // Tous les jours à 03:15
    @Scheduled(cron = "0 15 3 * * *")
    public void expireOldPayments() {
        var limit = Instant.now().minus(14, ChronoUnit.DAYS);
        var olds = paiementRepo.findByStatutAndDateCreationBefore(PaiementStatut.CREATED, limit);

        olds.forEach(p -> {
            try {
                if (p.getStripeIntentId() != null) {
                    // annule chez Stripe si pas déjà annulé/success
                    stripePort.cancelPaymentIntent(p.getStripeIntentId());
                }
            } catch (RuntimeException ignore) {}

            p.setStatut(PaiementStatut.EXPIRED);
        });

        if (!olds.isEmpty()) {
            paiementRepo.saveAll(olds);
        }
    }
}
