# Inventaire des endpoints disponibles (22-02-2026)

Ce document liste les endpoints exposés par les 3 backends du projet :

- **Laravel** : Core Academix (auth, scolarité, admin/chef/student)
- **Node.js** : Temps-réel + chat collaboratif (sessions, messages privés, notifications)
- **Python/FastAPI** : IA (résumés, quiz, exercices, images, RAG)

## Base URLs (Frontend)

Variables utilisées par [frontend/src/api/client.js](../frontend/src/api/client.js) :

- `VITE_LARAVEL_API_URL` (par défaut `http://localhost:8000/api/v1`)
- `VITE_NODE_API_URL` (par défaut `http://localhost:3001/api`)
- `VITE_SOCKET_URL` (par défaut `http://localhost:3001`)
- `VITE_PYTHON_API_URL` (par défaut `http://localhost:5000/api/v1`)

## Auth (important)

- **Laravel** : `auth:sanctum` (token de type `Bearer {id}|{plainTextToken}`)
- **Node.js** : middleware `auth` relié à **Laravel Sanctum** (même format Bearer)
- **Python** : dépendance `get_current_user` qui vérifie le token Sanctum via MySQL (même format Bearer)

Donc : **un seul token Laravel** suffit à authentifier Node + Python.

---

## Laravel (backend/laravel)

Préfixe : `/api/v1`

### Auth `/auth/*`

- `POST /auth/admin/register`
- `POST /auth/admin/login`
- `POST /auth/admin/logout` (auth)

- `POST /auth/chef/login`
- `POST /auth/chef/logout` (auth)

- `POST /auth/student/register` (auth)
- `POST /auth/student/login`
- `POST /auth/student/activate`
- `POST /auth/student/logout` (auth)

- `GET /auth/me` (auth)

### Super admin `/admin/*` (auth + super.admin)

- Départements
  - `GET /admin/departements`
  - `POST /admin/departements`
  - `GET /admin/departements/{id}`
  - `PUT /admin/departements/{id}`
  - `DELETE /admin/departements/{id}`
  - `GET /admin/departements/{id}/stats`

- Chefs de département
  - `GET /admin/chefs-departement`
  - `POST /admin/chefs-departement`
  - `GET /admin/chefs-departement/{id}`
  - `PUT /admin/chefs-departement/{id}`
  - `DELETE /admin/chefs-departement/{id}`
  - `POST /admin/chefs-departement/{id}/toggle`

- Statistiques
  - `GET /admin/stats/global`
  - `GET /admin/stats/dashboard`

- Matières (apiResource)
  - `GET /admin/matieres`
  - `POST /admin/matieres`
  - `GET /admin/matieres/{id}`
  - `PUT /admin/matieres/{id}`
  - `DELETE /admin/matieres/{id}`

- Notes (apiResource)
  - `GET /admin/notes`
  - `POST /admin/notes`
  - `GET /admin/notes/{id}`
  - `PUT /admin/notes/{id}`
  - `DELETE /admin/notes/{id}`

- Emploi du temps
  - `GET /admin/emploi-temps/filieres/{id}`
  - `GET /admin/emploi-temps`
  - `POST /admin/emploi-temps`
  - `GET /admin/emploi-temps/{id}`
  - `PUT /admin/emploi-temps/{id}`
  - `DELETE /admin/emploi-temps/{id}`

### Chef / Admin département `/departement/*` (auth + admin.departement.owner)

- Matières (apiResource)
  - `GET /departement/matieres`
  - `POST /departement/matieres`
  - `GET /departement/matieres/{id}`
  - `PUT /departement/matieres/{id}`
  - `DELETE /departement/matieres/{id}`

- Filières
  - `GET /departement/filieres`
  - `POST /departement/filieres`
  - `GET /departement/filieres/{id}`
  - `PUT /departement/filieres/{id}`
  - `DELETE /departement/filieres/{id}`

  - `POST /departement/filieres/{id}/matieres`
  - `DELETE /departement/filieres/{id}/matieres/{matiere_id}`

  - `GET /departement/filieres/{id}/etudiants`
  - `GET /departement/filieres/{id}/stats`
  - `GET /departement/filieres/{id}/emploi-temps`

- Étudiants + imports
  - `GET /departement/etudiants`
  - `POST /departement/import/etudiants` (multipart)
  - `POST /departement/import/notes` (multipart)

- Notes (apiResource)
  - `GET /departement/notes`
  - `POST /departement/notes`
  - `GET /departement/notes/{id}`
  - `PUT /departement/notes/{id}`
  - `DELETE /departement/notes/{id}`

- Emploi du temps (apiResource)
  - `GET /departement/emploi-temps`
  - `POST /departement/emploi-temps`
  - `GET /departement/emploi-temps/{id}`
  - `PUT /departement/emploi-temps/{id}`
  - `DELETE /departement/emploi-temps/{id}`

- Dashboard
  - `GET /departement/dashboard`

### Student `/student/*` (auth + student)

- Profil / notes / emploi du temps
  - `GET /student/profil`
  - `GET /student/notes`
  - `GET /student/emploi-temps`

- Tâches
  - `GET /student/taches`
  - `POST /student/taches`
  - `GET /student/taches/{id}`
  - `PUT /student/taches/{id}`
  - `DELETE /student/taches/{id}`
  - `PATCH /student/taches/{id}/complete`

- Alertes
  - `GET /student/alertes`
  - `PATCH /student/alertes/{id}/read`

---

## Node.js (backend/node)

Préfixe : `/api`

- `GET /` (info)
- `GET /health`

- Tests
  - `GET /api/test`
  - `POST /api/test/echo`
  - `GET /api/test/hello/{name}`

- Messages privés (auth)
  - `GET /api/messages/conversations`
  - `GET /api/messages/unread-count`
  - `GET /api/messages/{userId}`
  - `POST /api/messages`
  - `PATCH /api/messages/{messageId}/read`

- Sessions collaboratives (auth)
  - `GET /api/sessions`
  - `POST /api/sessions`
  - `POST /api/sessions/{id}/join`
  - `POST /api/sessions/{id}/rate`

- Chat session (auth)
  - `POST /api/chat/upload` (multipart)
  - `GET /api/chat/{sessionId}/messages`
  - `GET /api/chat/{sessionId}/participants`
  - `GET /api/chat/{sessionId}/mentions`
  - `GET /api/chat/{sessionId}/whiteboard-state`

- Notifications (auth)
  - `GET /api/notifications`
  - `GET /api/notifications/unread-count`
  - `POST /api/notifications`
  - `PATCH /api/notifications/read-all`
  - `PATCH /api/notifications/{id}/read`
  - `DELETE /api/notifications/{id}`

---

## Python / FastAPI (python)

Préfixe : `/api/v1`

- Root
  - `GET /` (status)

- RAG
  - `POST /api/v1/chat`
  - `POST /api/v1/upload`

- Summary (auth)
  - `POST /api/v1/summary/generate` (multipart)
  - `GET /api/v1/summary/{summary_id}`
  - `GET /api/v1/summary/download/{summary_id}`

- Quiz (auth)
  - `POST /api/v1/quiz/generate` (multipart)
  - `POST /api/v1/quiz/correct`
  - `GET /api/v1/quiz/{quiz_id}`

- Exercises (auth)
  - `POST /api/v1/exercises/generate` (multipart)
  - `GET /api/v1/exercises/{exercise_id}`
  - `GET /api/v1/exercises/download/{exercise_id}`

- Image (auth)
  - `POST /api/v1/image/generate?prompt=...`
  - `GET /api/v1/image/download/{filename}`
