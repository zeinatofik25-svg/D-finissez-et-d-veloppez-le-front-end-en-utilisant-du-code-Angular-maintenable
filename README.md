# TéléSport – Olympic Games (Angular)

Application Angular permettant de visualiser les performances olympiques par pays.

## Sommaire

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement](#lancement)
- [Fonctionnalités](#fonctionnalités)
- [Routes](#routes)
- [Gestion des erreurs (UX)](#gestion-des-erreurs-ux)
- [Responsive](#responsive)
- [Tests](#tests)
- [Structure du projet](#structure-du-projet)
- [Captures d’écran](#captures-décran)

## Prérequis

- Node.js (préférer une version **LTS**)
- npm
- Angular CLI 

## Installation

```bash
npm install
```

## Lancement

```bash
npm start
```

Puis ouvrir `http://localhost:4200/`.

## Fonctionnalités

- Dashboard : KPIs (nombre de pays, nombre de JOs) + pie chart des médailles totales par pays
- Navigation : clic sur un pays dans le pie chart → page détail `/country/:countryName`
- Détail pays : KPIs (participations, total médailles, athlètes) + graphique d’évolution par année
- Bouton « Go back » vers le dashboard

## Routes

- `/` : Dashboard (Home)
- `/country/:countryName` : Détail d’un pays
- `/not-found` : Page d’erreur
- `**` : fallback (route inconnue) → NotFound

Voir la configuration dans [src/app/app-routing.module.ts](src/app/app-routing.module.ts).

## Gestion des erreurs (UX)

- URL inconnue → redirection vers la page NotFound
- Pays inexistant (`/country/...`) → redirection vers NotFound
- Chargement : un message « Loading... » s’affiche tant que les données ne sont pas prêtes
- Données manquantes : message « Aucune donnée » lorsque c’est applicable

Les messages affichés côté utilisateur sont normalisés via [src/app/services/error/error.service.ts](src/app/services/error/error.service.ts).

## Responsive

L’UI est testée via les DevTools (mobile/desktop). Le layout reste utilisable sur mobile (contenu empilé) et sur desktop.

## Tests

Exécuter les tests une fois en headless :

```bash
npm run test -- --watch=false --browsers=ChromeHeadless
```

## Structure du projet

- Pages (routées) : [src/app/pages](src/app/pages)
	- `home/` (dashboard)
	- `country/` (détail pays)
	- `not-found/`
	- `header/` (composant réutilisable titre + KPIs)
	- `pie-chart/`, `line-chart/` (charts)
- Services : [src/app/services](src/app/services)
	- `data/` : accès aux données (mock JSON)
	- `statistics/` : logique métier (agrégations)
	- `chart/` : encapsulation Chart.js
	- `error/` : messages d’erreurs côté utilisateur

Plus de détails : [ARCHITECTURE.md](ARCHITECTURE.md)
