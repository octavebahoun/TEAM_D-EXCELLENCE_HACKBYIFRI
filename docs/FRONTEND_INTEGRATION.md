# Documentation complète de l'intégration du frontend Academix

## Structure générale

- **React (Vite)** : SPA, routing avec `react-router-dom`
- **Tailwind CSS** : Thème via variables CSS, design responsive
- **framer-motion** : Animations UI
- **API clients** : Abstraction via services (axios)

---

## Routing & Pages

| Page / Route      | Composants principaux               | API(s) consommées (services)                                               |
| ----------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| `/login`          | LoginPage                           | `authService.login()`                                                      |
| `/register`       | RegisterPage                        | `authService.register()`                                                   |
| `/admin/*`        | AdminDashboard                      | `adminService.*` (CRUD, stats, etc.)                                       |
| `/chef/dashboard` | ChefDashboard, Sidebar, Header, ... | `departementService.getDashboard()`                                        |
| `/chef/filieres`  | FiliereList, FiliereDetail          | `departementService.getFilieres()`, `departementService.getFiliere()`      |
| `/chef/import`    | ImportPanel                         | `departementService.importEtudiants()`, `departementService.importNotes()` |
| `/chef/edt`       | EmploiDuTempsPanel                  | `departementService.getEmploiTemps()`                                      |
| `/ai-tools`       | AIToolsPage                         | `aiService.*` (génération, quiz, etc.)                                     |
| `/chat`           | ChatPage, SessionsFeedPage          | `realtimeService.*` (chat, notifications)                                  |

---

## Détail par page

### 1. Login / Register

- **API** : `authService.login()`, `authService.register()`
- **Réponse** : Token, user info, redirection selon rôle

### 2. AdminDashboard

- **API** : `adminService.getStats()`, `adminService.getUsers()`, `adminService.createUser()`, etc.
- **Fonctionnalités** : Gestion utilisateurs, stats, logs

### 3. ChefDashboard

- **API** : `departementService.getDashboard()`
- **Composants** : Sidebar, Header, StatsCards, DepartementBanner, FiliereList, DepartementStats, ActionsPanel, AddFiliereModal
- **Données** : filières, stats, info département

### 4. Gestion Filières

- **API** : `departementService.getFilieres()`, `departementService.getFiliere()`, `departementService.createFiliere()`, `departementService.updateFiliere()`, `departementService.deleteFiliere()`
- **Composants** : Liste, détail, CRUD

### 5. Import CSV

- **API** : `departementService.importEtudiants()`, `departementService.importNotes()`
- **Composants** : Upload, feedback, logs

### 6. Emploi du Temps

- **API** : `departementService.getEmploiTemps()`, `departementService.createEmploiTemps()`, `departementService.updateEmploiTemps()`, `departementService.deleteEmploiTemps()`
- **Composants** : Vue calendrier, CRUD

### 7. AI Tools

- **API** : `aiService.generateContent()`, `aiService.generateQuiz()`, etc.
- **Composants** : Génération IA, quiz, correction

### 8. Chat

- **API** : `realtimeService.sendMessage()`, `realtimeService.getMessages()`, `realtimeService.getNotifications()`
- **Composants** : Chat, notifications, sessions

---

## Services API (frontend/src/services/)

- **authService** : Authentification, gestion token
- **adminService** : Endpoints admin
- **departementService** : Endpoints chef de département (filières, étudiants, notes, emploi du temps, import)
- **aiService** : Endpoints IA
- **realtimeService** : Chat, notifications

---

## Hooks

- **useDepartementData** : Récupération dashboard chef (filières, stats)
- **useAuth** : Gestion session utilisateur

---

## Points d'intégration

- Toutes les pages consomment les services API via hooks ou appels directs
- Les réponses API sont typées et validées côté frontend
- Les erreurs sont gérées par des messages UI (ex: `Erreur: {error}`)
- Les composants sont modulaires et réutilisables

---

## Personnalisation

- Thème via variables CSS Tailwind (ex: `bg-[var(--bg)]`)
- Animations via framer-motion
- Navigation via Sidebar (routes dynamiques)

---

## À compléter

- Ajouter la documentation pour chaque service (ex: endpoints, params, réponses)
- Ajouter des exemples d’intégration (ex: appel API, gestion loading/error)

---

**Pour toute nouvelle page, il suffit de créer un service API dédié et d’intégrer les hooks ou appels dans le composant concerné.**
