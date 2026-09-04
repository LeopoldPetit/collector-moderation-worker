# collector-moderation-worker

Worker de **contrôle automatique** des articles pour le projet **Collector.shop**. Consomme les événements RabbitMQ publiés par [`collector-catalog-api`](https://github.com/LeopoldPetit/collector-catalog-api) et applique les règles de modération avant mise en vente.

## Rôle dans le projet

Ce service implémente l'exigence métier : *"la mise en ligne d'un article n'est proposée à la vente qu'après un contrôle automatisé le plus possible"*.

Flux :
1. Consomme l'événement `article.submitted` depuis RabbitMQ
2. Applique les règles de contrôle automatique :
   - Champs obligatoires présents
   - Description ≥ 50 caractères
   - Prix cohérent avec la catégorie (> 0 et < seuil catégorie)
   - Absence de mots interdits
3. Publie `article.validated` ou `article.rejected` (avec motif) sur RabbitMQ

## Stack

| Composant | Rôle |
|---|---|
| NestJS (microservice) | Réutilise les mêmes conventions que l'API principale |
| RabbitMQ | Consommation/publication des événements de modération |
| Jest | Tests unitaires des règles de contrôle |
| Docker + Trivy | Conteneurisation et scan de vulnérabilités |

## Règles de contrôle automatique

| Règle | Condition |
|---|---|
| Champs obligatoires | Titre, description, prix, frais de port, catégorie présents |
| Longueur description | ≥ 50 caractères |
| Cohérence du prix | Prix > 0 et inférieur au seuil défini pour la catégorie |
| Mots interdits | Absence de termes bannis dans le titre/description |

## Backlog (US concernées)

- **US3** — Contrôle automatique d'un article soumis (règles + publication du résultat)
- **US6** — Pipeline CI/CD (lint, tests, build Docker, scan Trivy)

## Démarrage local

Nécessite l'environnement de développement fourni par [`collector-infra`](https://github.com/LeopoldPetit/collector-infra) (RabbitMQ).

```bash
npm install
npm run start:dev
```

## Tests

```bash
npm run test          # tests unitaires des règles de contrôle
npm run test:cov       # couverture
```

## Documentation liée

Voir le repo [`collector-docs`](https://github.com/LeopoldPetit/collector-docs) pour le plan général, l'architecture détaillée et le backlog complet du projet.
