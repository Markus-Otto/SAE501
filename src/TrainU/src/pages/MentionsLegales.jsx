import React from 'react';

export default function MentionsLegales() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 sm:p-12">

                {/* Titre principal */}
                <h1 className="text-4xl font-bold text-slate-100 mb-8 text-center">
                    Mentions Légales
                </h1>

                {/* 1. Informations légales */}
                <section className="mb-10 pb-8 border-b border-white/10">
                    <h2 className="text-2xl font-semibold text-slate-100 mb-4">1. Informations légales</h2>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-4">
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">Éditeur du site</h3>
                        <div className="space-y-2 text-slate-300">
                            <p><span className="font-medium text-slate-200">Nom de la société :</span> TrainU</p>
                            <p><span className="font-medium text-slate-200">Forme juridique :</span> [À compléter - ex: SAS, SARL, etc.]</p>
                            <p><span className="font-medium text-slate-200">Capital social :</span> [À compléter]</p>
                            <p><span className="font-medium text-slate-200">Siège social :</span> [À compléter - Adresse complète]</p>
                            <p><span className="font-medium text-slate-200">SIRET :</span> [À compléter]</p>
                            <p><span className="font-medium text-slate-200">RCS :</span> [À compléter]</p>
                            <p><span className="font-medium text-slate-200">Numéro de TVA intracommunautaire :</span> [À compléter]</p>
                            <p><span className="font-medium text-slate-200">Email :</span> contact@trainu.fr</p>
                            <p><span className="font-medium text-slate-200">Téléphone :</span> [À compléter]</p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">Directeur de la publication</h3>
                        <div className="space-y-2 text-slate-300">
                            <p><span className="font-medium text-slate-200">Nom :</span> [À compléter]</p>
                            <p><span className="font-medium text-slate-200">Email :</span> [À compléter]</p>
                        </div>
                    </div>
                </section>

                {/* 2. Hébergement */}
                <section className="mb-10 pb-8 border-b border-white/10">
                    <h2 className="text-2xl font-semibold text-slate-100 mb-4">2. Hébergement</h2>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <div className="space-y-2 text-slate-300">
                            <p><span className="font-medium text-slate-200">Hébergeur :</span> [À compléter - Nom de l'hébergeur]</p>
                            <p><span className="font-medium text-slate-200">Adresse :</span> [À compléter]</p>
                            <p><span className="font-medium text-slate-200">Téléphone :</span> [À compléter]</p>
                            <p><span className="font-medium text-slate-200">Site web :</span> [À compléter]</p>
                        </div>
                    </div>
                </section>

                {/* 3. Propriété intellectuelle */}
                <section className="mb-10 pb-8 border-b border-white/10">
                    <h2 className="text-2xl font-semibold text-slate-100 mb-4">3. Propriété intellectuelle</h2>
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                        <p>
                            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur
                            et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour
                            les documents téléchargeables et les représentations iconographiques et photographiques.
                        </p>
                        <p>
                            La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est
                            formellement interdite sauf autorisation expresse du directeur de la publication.
                        </p>
                        <p>
                            Les marques et logos figurant sur le site sont des marques déposées. Toute reproduction totale
                            ou partielle de ces marques ou de ces logos effectuée à partir des éléments du site sans
                            l'autorisation expresse de TrainU est donc prohibée.
                        </p>
                    </div>
                </section>

                {/* 4. Protection des données personnelles */}
                <section className="mb-10 pb-8 border-b border-white/10">
                    <h2 className="text-2xl font-semibold text-slate-100 mb-4">4. Protection des données personnelles</h2>
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                        <p>
                            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique
                            et Libertés du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de rectification,
                            de suppression et d'opposition aux données personnelles vous concernant.
                        </p>
                        <p>
                            Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : <span className="font-medium text-[#EB5B5B]">contact@trainu.fr</span>
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mt-4">
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">Données collectées</h3>
                        <p className="text-slate-300 mb-2">Les données personnelles collectées sur ce site sont les suivantes :</p>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                            <li>Nom et prénom</li>
                            <li>Adresse email</li>
                            <li>Numéro de téléphone (si fourni)</li>
                            <li>Informations de connexion et d'utilisation du site</li>
                            <li>Données de paiement (traitées de manière sécurisée par notre prestataire Stripe)</li>
                        </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mt-4">
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">Finalité de la collecte</h3>
                        <p className="text-slate-300 mb-2">Les données personnelles sont collectées pour :</p>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                            <li>La gestion de votre compte utilisateur</li>
                            <li>L'inscription et la gestion des formations</li>
                            <li>Le traitement des paiements</li>
                            <li>L'envoi d'informations relatives aux formations</li>
                            <li>L'amélioration de nos services</li>
                        </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mt-4">
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">Conservation des données</h3>
                        <p className="text-slate-300">
                            Vos données personnelles sont conservées pendant la durée nécessaire à la réalisation
                            des finalités pour lesquelles elles ont été collectées, et conformément aux obligations
                            légales en vigueur.
                        </p>
                    </div>
                </section>

                {/* 5. Cookies */}
                <section className="mb-10 pb-8 border-b border-white/10">
                    <h2 className="text-2xl font-semibold text-slate-100 mb-4">5. Cookies</h2>
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                        <p>
                            Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic.
                            En naviguant sur ce site, vous acceptez l'utilisation de cookies.
                        </p>
                        <p>
                            Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant, certaines
                            fonctionnalités du site pourraient ne pas fonctionner correctement.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mt-4">
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">Types de cookies utilisés</h3>
                        <ul className="space-y-2 text-slate-300">
                            <li><span className="font-medium text-slate-200">Cookies essentiels :</span> Nécessaires au fonctionnement du site (authentification, panier, etc.)</li>
                            <li><span className="font-medium text-slate-200">Cookies de performance :</span> Permettent d'analyser l'utilisation du site</li>
                            <li><span className="font-medium text-slate-200">Cookies fonctionnels :</span> Mémorisent vos préférences</li>
                        </ul>
                    </div>
                </section>

                {/* 6. Responsabilité */}
                <section className="mb-10 pb-8 border-b border-white/10">
                    <h2 className="text-2xl font-semibold text-slate-100 mb-4">6. Responsabilité</h2>
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                        <p>
                            TrainU s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site.
                            Toutefois, TrainU ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations
                            mises à disposition sur ce site.
                        </p>
                        <p>
                            TrainU ne pourra être tenu responsable des dommages directs ou indirects résultant de l'accès
                            au site ou de l'utilisation du site, y compris l'inaccessibilité, les pertes de données,
                            détériorations, destructions ou virus qui pourraient affecter votre équipement informatique.
                        </p>
                    </div>
                </section>

                {/* 7. Liens hypertextes */}
                <section className="mb-10 pb-8 border-b border-white/10">
                    <h2 className="text-2xl font-semibold text-slate-100 mb-4">7. Liens hypertextes</h2>
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                        <p>
                            Le site peut contenir des liens hypertextes vers d'autres sites. TrainU n'exerce aucun contrôle
                            sur ces sites et décline toute responsabilité quant à leur contenu.
                        </p>
                        <p>
                            La mise en place de liens hypertextes vers le site TrainU nécessite une autorisation préalable
                            écrite. Cette autorisation peut être demandée à l'adresse : contact@trainu.fr
                        </p>
                    </div>
                </section>

                {/* 8. Droit applicable */}
                <section className="mb-10 pb-8 border-b border-white/10">
                    <h2 className="text-2xl font-semibold text-slate-100 mb-4">8. Droit applicable et juridiction compétente</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut
                        d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles
                        de compétence en vigueur.
                    </p>
                </section>

                {/* 9. Crédits */}
                <section className="mb-10 pb-8 border-b border-white/10">
                    <h2 className="text-2xl font-semibold text-slate-100 mb-4">9. Crédits</h2>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <div className="space-y-2 text-slate-300">
                            <p><span className="font-medium text-slate-200">Conception et développement :</span> [À compléter]</p>
                            <p><span className="font-medium text-slate-200">Design :</span> [À compléter]</p>
                            <p><span className="font-medium text-slate-200">Photographies :</span> [À compléter si applicable]</p>
                        </div>
                    </div>
                </section>

                {/* 10. Contact */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-slate-100 mb-4">10. Contact</h2>
                    <p className="text-slate-300 mb-4">
                        Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
                    </p>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <div className="space-y-2 text-slate-300">
                            <p><span className="font-medium text-slate-200">Par email :</span> contact@trainu.fr</p>
                            <p><span className="font-medium text-slate-200">Par courrier :</span> [Adresse postale à compléter]</p>
                            <p><span className="font-medium text-slate-200">Par téléphone :</span> [Numéro à compléter]</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-white/10 text-center">
                    <p className="text-sm text-slate-400">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

            </div>
        </div>
    );
}
