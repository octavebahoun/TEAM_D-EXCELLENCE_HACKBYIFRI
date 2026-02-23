# Plan d’implémentation du Dashboard Chef de Département

## 1. Structure des composants

- `components/Sidebar.jsx` : sidebar navigation (Vue d’ensemble, Gestion Filières, Import CSV, Emploi du Temps, Déconnexion)
- `components/DashboardHeader.jsx` : header (logo, titre, année, switch thème)
- `components/StatsCards.jsx` : cards stats (Filières, Étudiants, Matières, Moyenne)
- `components/DepartementBanner.jsx` : info département (nom, code, chef, année)
- `components/FiliereList.jsx` : liste filières (expand/collapse, badge actif, stats)
- `components/DepartementStats.jsx` : stats département (taux réussite, assiduité, abandons)
- `components/ActionsPanel.jsx` : actions rapides (Import CSV, Emploi du Temps, Rapports)
- `components/AddFiliereModal.jsx` : modal ajout filière
- `pages/ChefDashboard.jsx` : page principale (layout, consommation API, gestion état)

## 2. Variables CSS Tailwind (thème)

- Utiliser `:root` pour définir les couleurs principales (primary, secondary, accent, bg, text, etc.)
- Switch light/dark via Tailwind + variables CSS (ex : `bg-[var(--bg)]`, `text-[var(--text)]`)
- Classes utilitaires pour responsive, padding, margin, border, shadow, rounded, etc.

## 3. Animations framer-motion

- Sidebar : slide-in/out, hover, active
- Cards stats : fade-in, stagger, hover scale
- Modals : fade/scale, backdrop
- Actions rapides : hover, click feedback
- Transitions page : fade/slide

## 4. Mapping API → hooks → UI

- Utiliser `departementService.getDashboard`, `departementService.getFilieres`, `departementService.getFiliereStats`, etc.
- Hooks personnalisés : `useDepartementDashboard`, `useFilieres`, `useThemeSwitcher`
- Gestion loading/error avec framer-motion (squelettes, spinner, feedback)

## 5. Accessibilité & responsive

- Focus visible, aria-label, alt pour images/icons
- Responsive sidebar (mobile : drawer)
- Utilisation de Tailwind pour breakpoints

## 6. Points à valider

- Respect strict des skills (tailwind-best-practices, framer-motion-animator)
- Variables CSS modifiables facilement
- Anciennes pages conservées (pas de suppression)
- Structure extensible pour autres rôles (admin, student)

---

Dès validation, je commence l’implémentation des composants et hooks selon ce plan.
