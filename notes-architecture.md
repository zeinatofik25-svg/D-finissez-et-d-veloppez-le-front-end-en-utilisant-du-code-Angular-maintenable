# Notes d'architecture — Analyse initiale

Principales observations (classement par priorité)
------------------------------------------------

1) Appels HTTP effectués directement dans les composants
   - Fichiers concernés : src/app/pages/home/home.component.ts, src/app/pages/country/country.component.ts.
   - Pourquoi c'est un problème : anti-pattern — empêche la réutilisabilité, rend difficile le test unitaire, duplique la logique d'accès aux données.
   - Risque : dette technique rapide quand l'API évoluera (auth, erreurs, cache, pagination).

2) Absence d'abstraction (pas de services / modèles)
   - Observé : URL ./assets/mock/olympic.json dupliquée dans plusieurs composants.

3) Usage excessif de `any` et absence de typage strict
   - Emplacements : mapping et reduce dans `home.component.ts` et `country.component.ts` utilisent `any` partout.
   - Conséquence : erreurs temps d'exécution non détectées par TypeScript ; mauvaise lisibilité.

4) Manipulation des observables / memory leaks
   - Observé : `subscribe` directement sans `unsubscribe`, pas d'`OnDestroy` ni `takeUntil` ou `async` pipe.
   - Risque : fuites mémoire si les composants sont détruits puis recréés (navigation).

5) Gestion d'erreurs minimale et logs en prod
   - Observé : `console.log` et assignation basique de `error.message` sans interface utilisateur — pas de notifications utilisables.
   - Recommandation : centraliser la gestion d'erreurs dans un service et afficher des messages utilisateur clairs.

6) Logique métier fragile / null-safety
   - Exemple : dans `country.component.ts`, `selectedCountry.country` est utilisé sans vérification que `selectedCountry` existe → possible crash si paramètre invalide.

7) Code duplication pour la construction des charts
   - Observé : Chart.js est instancié directement dans les composants (`buildPieChart`, `buildChart`) avec configuration en dur.

8) Conversion et transformations imprécises
   - Exemple : conversion `medalsCount` → `toString()` puis `parseInt()` dans `country.component.ts` (inefficace et source d'erreurs).

9) Magic strings et valeurs codées en dur
   - Couleurs, ID d'élément ("DashboardPieChart") et chemins sont codés en dur. Centraliser dans des constantes ou configuration.

10) Tests et qualité
   - Présence de fichiers `*.spec.ts` mais pas d'assertions visibles ; pas d'ESLint/TSLint config repérée ici.


Risques à court terme
--------------------
- Plantage possible si `countryName` est invalide.
- Difficulté à remplacer la source de données (mock → API) à cause du code couplé aux composants.
- Fuites mémoire en navigation répétée.


Architecture proposée
---------------------

Structure recommandée (à appliquer sous `src/app/`)

   src/app/
   ├── core/                    # Fournit des singletons et configuration applicative
   │   ├── services/            # Services singletons utilisés dans toute l'app (ex: ErrorHandler, ApiInterceptor)
   │   └── config.ts            # Constantes d'environnement non sensibles
   ├── services/                # Services métier / points d'accès aux données
   │   └── olympic/             # Regrouper par domaine si besoin
   │       ├── olympic.service.ts
   │       └── olympic.service.spec.ts
   ├── models/                  # Interfaces / types partagés
   │   ├── country.model.ts
   │   └── participation.model.ts
   ├── pages/                   # Containers / pages routées (plus légers possible)
   │   ├── home/
   │   │   ├── home.component.ts
   │   │   ├── home.component.html
   │   │   └── home.component.spec.ts
   │   └── country/
   │       ├── country.component.ts
   │       └── country.component.spec.ts
   ├── components/              # Composants réutilisables (charts, widgets)
   │   └── charts/
   │       ├── pie-chart.component.ts
   │       └── line-chart.component.ts
   ├── shared/                  # Pipes, directives, helpers UI réutilisables
   └── app.module.ts

Placement virtuel des fichiers actuels
- `src/app/pages/home/home.component.ts`  → `src/app/pages/home/home.component.ts` (page)
- `src/app/pages/country/country.component.ts` → `src/app/pages/country/country.component.ts` (page)
- new `src/app/services/data/data.service.ts` ← extraire les appels HTTP et le parsing de `./assets/mock/olympic.json`
- new `src/app/models/country.model.ts` et `participation.model.ts` ← remplacer `any`
- extraire la création Chart.js dans `src/app/components/charts/*` (ou `src/app/services/chart.service.ts` si logique non-UI)

Patterns et choix techniques
- Services : Singleton (Angular `providedIn: 'root'`) pour `OlympicService`, `ErrorService` et `ChartService`.
- Séparation component/service : les composants ne contiennent que la logique de présentation et liaisons UI ; toute récupération/transformation des données est dans les services.
- Typage fort : définir `Country` et `Participation` en `models/` et activer progressivement `strict` TS.
- Observables : exposer des Observables depuis les services et consommer dans les composants via `async` pipe ou `takeUntil` pour éviter les fuites.
- Erreurs : centraliser la gestion d'erreurs et retravailler les messages utilisateurs via un `NotificationService`.

Comment ceci facilite l'intégration d'un back-end
- Tous les points d'accès aux données sont concentrés dans `src/app/services/` : remplacer le mock JSON par des requêtes HTTP vers l'API sera localisé dans `OlympicService`.
- Les composants et tests ne changent pas fondamentalement : on modifie le service pour appeler l'API réelle.


