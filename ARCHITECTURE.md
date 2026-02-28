# Architecture Front-End (Angular)

Ce document décrit l’architecture du projet (Angular 18), ses responsabilités par couche, et les conventions à suivre pour maintenir un code lisible et testable.

## Stack & principes

- **Framework** : Angular 18 (CLI 18.0.x), projet basé sur un `AppModule` (architecture "NgModule" classique).
- **UI** : pages routées + composants de rendu (charts).
- **Données** : mock local `src/assets/mock/olympic.json` consommé via `HttpClient`.
- **Architecture** : séparation claire entre **accès aux données** (`DataService`), **logique métier** (`StatisticsService`) et **présentation** (pages/components).
- **Qualité** : TypeScript en mode `strict: true` + `strictTemplates: true`.

## Structure des dossiers

```
src/app/
├── app.module.ts                # module racine + déclarations
├── app-routing.module.ts        # routes de l’app
├── core/
│   └── config.ts                # constantes applicatives (Chart.js, ids, couleurs)
├── models/
│   ├── country.model.ts
│   └── participation.model.ts
├── pages/                       # composants (routés) + composants UI de chart
│   ├── home/                    # dashboard
│   ├── country/                 # détail pays
│   ├── not-found/               # fallback 404
│   ├── pie-chart/               # composant Chart.js pie
│   └── line-chart/              # composant Chart.js line
└── services/
    ├── data/                    # accès aux données (source mock / future API)
    ├── statistics/              # logique métier / transformations
    ├── chart/                   # encapsulation Chart.js
    └── error/                   # normalisation/log des erreurs
```

## Routing

- Route racine : `''` → `HomeComponent`.
- Détail pays : `'country/:countryName'` → `CountryComponent`.
- Fallback : `**` → `NotFoundComponent`.

Le template racine `AppComponent` se limite à `<router-outlet>`.

## Flux de données (runtime)

### Dashboard (`HomeComponent`)

1. `HomeComponent` appelle `StatisticsService.getGlobalStatistics()`.
2. `StatisticsService` récupère la liste via `DataService.getCountries()`.
3. `StatisticsService` calcule :
   - `totalCountries`
   - `totalJOs` (années uniques)
   - `countryLabels`
   - `medalsByCountry`
4. `HomeComponent` passe `labels/data` au composant `app-pie-chart`.
5. `PieChartComponent` délègue à `ChartService` la création du graphique Chart.js.

### Détail pays (`CountryComponent`)

1. `CountryComponent` lit `countryName` depuis la route.
2. Il appelle `StatisticsService.getCountryStatistics(countryName)`.
3. `StatisticsService` calcule :
   - `years`, `medalsByYear`
   - `totalMedals`, `totalAthletes`
4. `CountryComponent` passe `labels/data` au composant `app-line-chart`.

### Gestion d’erreurs

- Les pages interceptent les erreurs et exposent un message utilisateur via `ErrorService.handleError(err)`.
- `ErrorService` loggue l’erreur (actuellement via `console.error`).

## Services et responsabilités

### `DataService`

- Responsable de la **source** de données.
- Actuellement : `HttpClient.get<Country[]>('./assets/mock/olympic.json')`.
- Contrat : retourne `Observable<Country[]>`.

### `StatisticsService`

- Responsable de la **logique métier** : agrégation, totaux, projections pour la UI.
- Ne dépend que de `DataService`.
- Expose des DTO orientés UI : `OlympicStatistics`, `CountryStatistics`.

### `ChartService`

- Encapsule Chart.js : création de config, datasets, couleurs, options.
- Ajoute optionnellement un handler de click (pour naviguer depuis un pie chart).

### `ErrorService`

- Convertit n’importe quelle erreur en message lisible + log.
- Point d’extension naturel : branchement vers un outil de monitoring (Sentry, AppInsights, etc.).

## Composants charts

- `PieChartComponent` et `LineChartComponent`:
  - utilisent `ChangeDetectionStrategy.OnPush`.
  - créent/actualisent le chart après `AfterViewInit`.
  - détruisent le chart dans `OnDestroy`.

Contrainte actuelle : `ChartService` instancie le chart via un `elementId` (DOM lookup). Cela fonctionne mais crée un couplage au DOM.

## Tests

- `StatisticsService` est testable de façon **unitaire** en mockant `DataService` (pas besoin d’HTTP).
- Les tests des pages (`HomeComponent`, `CountryComponent`) peuvent stubber les composants charts pour éviter Chart.js dans l’environnement Karma.
