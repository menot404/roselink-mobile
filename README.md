# RoseLink

Application mobile **gratuite** de prévention et d'accompagnement face au cancer du sein, pour les femmes
burkinabè. Projet réalisé pour le **Hackathon Octobre Rose 2026** (Orange Digital Center, Ouagadougou).

> RoseLink informe et oriente. Elle **ne remplace pas** un professionnel de santé.

## Ce que fait l'application

- **Prévention** : signes d'alerte, geste mensuel pas à pas, quiz « Mythes ou réalités », conseils en audio.
- **Carte** des centres de dépistage, triés par distance, avec itinéraire.
- **Chat** : une assistante, en deux espaces (prévention et accompagnement), avec sources.
- **Accompagnement** : journal d'humeur, respiration guidée, histoires de femmes, reconstruction et image de soi.
- **Association** : répertoire, don et demande d'aide (simulés).
- **Mode discret** : code PIN, empreinte ou visage, bouton « Quitter vite », aperçu masqué, notifications discrètes.
- **Rappels** : notifications locales (geste mensuel, humeur, rendez-vous).
- Thème clair et sombre, qui suit le téléphone.

## Ce qui est réel, ce qui est simulé

| Fonction | État |
|---|---|
| Contenus de santé | Sourcés (OMS, ministère, hôpitaux). **Relecture par un professionnel en cours.** |
| Chat | Base de réponses avec sources, **pas une IA libre**. |
| Audio | Sons de démonstration. Enregistrements d'experts à venir. |
| Carte et distances | Réelles. Fiches des centres **à vérifier**. |
| Histoires de femmes | **Fictives**. |
| Don et demande d'aide | **Simulés**. |
| Rappels | Notifications locales réelles. |
| Données | Elles restent sur le téléphone. |

## Pile technique

Expo (SDK 57) · React Native · TypeScript · Expo Router · NativeWind (Tailwind 3) · pnpm.
Carte : Leaflet dans une WebView (fonds © OpenStreetMap, © CARTO).

## Démarrer

Prérequis : Node 22.13 ou plus, pnpm, un téléphone avec Expo Go (ou un émulateur Android).

```bash
pnpm install
pnpm start        # puis scanner le QR code avec Expo Go
```

Le réglage `nodeLinker: hoisted` de `pnpm-workspace.yaml` est nécessaire : il permet à Metro de
résoudre les dépendances de NativeWind.

## Qualité

```bash
pnpm run typecheck   # vérification TypeScript
pnpm run check:chat  # contrôle des bases de connaissances du chat (cas de test inclus)
```

Ces deux commandes tournent à chaque Pull Request (voir `.github/workflows/ci.yml`).

## Structure

```
app/ ou src/app/          écrans (Expo Router)
src/features/             un dossier par fonctionnalité (chat, centres, audio, discret, rappels…)
src/components/ui/        composants d'interface
src/data/                 centres, associations, audios, histoires
src/context/              thème, compte
scripts/                  génération des sons de démonstration et des icônes, contrôle du chat
```

## Contenus et relecture

Toutes les réponses du chat sont listées avec leurs sources dans `15-fiche-relecture-chat.md`
(à régénérer avec `pnpm exec tsx scripts/make-review-sheet.ts` après modification). Chaque réponse porte
un statut : « sourcée » ou « à valider ». Ne retirer la mention « en cours de relecture »
(`SHOW_REVIEW_BADGE`) qu'après validation par un professionnel de santé.

## Générer une version installable (APK Android)

```bash
pnpm dlx eas-cli@latest build --platform android --profile preview
```

## Confidentialité et sécurité

- Aucune donnée n'est envoyée sur Internet : compte, journal, réglages et rappels restent sur le téléphone.
- Le code PIN n'est jamais enregistré en clair (empreinte salée dans le coffre du téléphone).
- « Effacer mes données » supprime tout ce que l'application a enregistré.
- Limite : un code à 4 chiffres protège contre une personne qui prend le téléphone quelques minutes,
  pas contre une attaque informatique.

## Contribuer

Une branche par fonctionnalité (`feat/...`), une Pull Request, puis fusion sur `main` quand la CI est verte.

## Feuille de route

1. Prototype (ce dépôt) : tous les modules, données de démonstration.
2. Vraies briques : modèle de langage avec garde-fous, voix d'experts en mooré, dioula et fulfuldé,
   base de centres vérifiée, dons Orange Money et Mobicash.
3. Accès : SMS/USSD, prise de rendez-vous, agents de santé communautaires, cartes hors ligne.
4. Échelle : tableau de bord anonymisé pour le ministère et les ONG, autres dépistages.

## Licence

Voir `LICENSE`.