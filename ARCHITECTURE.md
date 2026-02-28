# Documentation de l'architecture front-end

Ce document décrit la structure et les responsabilités de l'application Angular après la refactorisation. Il est destiné à aider les nouveaux développeurs à comprendre rapidement comment le projet est organisé et comment ajouter de nouvelles fonctionnalités.

## Structure des dossiers

```
src/app/
├── core/                    # singleton helpers et configuration globaux
│   ├── services/            # services applicatifs (ErrorService, ChartService...)
│   └── config.ts            # constantes (couleurs, IDs d'éléments, etc.)
├── services/                # services métier/domaine
│   └── data/                # couche d'accès aux données
│       └── data.service.ts  # expose les méthodes pour récupérer les données olympiques
├── models/                  # interfaces TypeScript partagées
│   ├── country.model.ts     # définition de Country et Participation
├── pages/                   # composants routés (conteneurs)
│   ├── home/                # vue du tableau de bord
│   │   ├── home.component.ts
│   │   └── home.component.html
│   └── country/             # vue de détail pour un pays
│       ├── country.component.ts
│       └── country.component.html
├── components/              # composants réutilisables
│   └── charts/              # (futur) composants pour graphiques pie/line
├── shared/                  # pipes, directives, utilitaires
└── app.module.ts            # module racine et routage
```

## Composants et leurs rôles

- **HomeComponent** (`src/app/pages/home/home.component.ts`)  
  Affiche le tableau de bord des médailles par pays. Il s'abonne à `DataService` pour récupérer la liste complète des pays, calcule les totaux (entrées, médailles, athlètes) et transmet les libellés/données à `ChartService` pour afficher un graphique en camembert. Il gère la navigation vers la page pays.

- **CountryComponent** (`src/app/pages/country/country.component.ts`)  
  Affiche les détails d'un seul pays déterminé par le paramètre de route. Il demande tous les pays à `DataService`, sélectionne celui qui correspond, calcule les totaux annuels et délègue la création du graphique à `ChartService`. Il se protège contre les noms invalides en redirigeant vers une page « non trouvé ».

Les autres pages (ex. `NotFoundComponent`) et éléments partagés se trouvent dans le dossier `pages/` mais ne sont pas centraux au flux de données.

## Services

- **DataService** (`src/app/services/data/data.service.ts`)  
  Service singleton (`providedIn: 'root'`) qui encapsule tout accès aux données. Il lit actuellement un fichier JSON local (`./assets/mock/olympic.json`) et retourne un `Observable<Country[]>`. Les composants n'interagissent jamais avec le JSON brut ; ils appellent `dataService.getCountries()` et travaillent avec des objets typés `Country`.  
  Dans un scénario réel, ce service contiendrait des appels HTTP à une API REST, et le reste de l'application resterait inchangé.

- **ChartService** (`src/app/services/chart/chart.service.ts`)  
  Service utilitaire responsable de la création et de la configuration des graphiques Chart.js. Les composants transmettent les IDs d'éléments, le type de graphique, les libellés et les données ; le service retourne une instance `Chart` configurée. Centraliser la logique des graphiques évite la duplication et facilite un changement de bibliothèque ou de thème plus tard.

- **ErrorService** (`src/app/services/error/error.service.ts`)  
  Normalise et enregistre les erreurs des appels HTTP, fournissant des messages compréhensibles que les composants peuvent afficher. Cela permet des améliorations futures comme l'envoi d'erreurs à un logger distant.

## Modèles

Tous les types métier sont déclarés dans `src/app/models` :

- `Country` décrit une nation et sa liste de enregistrements `Participation`.
- `Participation` enregistre l'année, le nombre de médailles et le nombre d'athlètes.

Le typage fort garantit la sécurité à la compilation et un code plus clair lors du calcul de sommes ou de la transformation de valeurs pour les graphiques.

## Comment cette architecture prépare pour un backend

En concentrant l'accès aux données dans `DataService`, le reste de l'application est isolé des changements concernant la provenance des données. Remplacer le JSON mock par un appel HTTP à une API ne requiert que modifier le service ; les composants continuent de s'abonner à la même `Observable<Country[]>`. Pareillement, la gestion des erreurs et les stratégies de cache peuvent être implémentées dans le service sans toucher au code de présentation.

Le `ChartService` et `ErrorService` singletons centralisent davantage les préoccupations transversales, rendant les modifications futures ou les tests beaucoup plus faciles.
