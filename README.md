# 🚀 AcademiX Platform

Plateforme académique intelligente avec IA générative pour étudiants.

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend API**: Laravel (PHP)
- **Backend WebSocket**: Node.js + Socket.io
- **Service IA**: Python + FastAPI

## 🚀 Démarrage rapide

### Installation
```bash
./setup-all.sh
```

### Lancement des services

#### Terminal 1 - Laravel
```bash
cd backend/laravel
php artisan serve
```

#### Terminal 2 - Node.js
```bash
cd backend/node
npm run dev
```

#### Terminal 3 - Python
```bash
cd python
source venv/bin/activate
uvicorn main:app --reload --port 8001
```

#### Terminal 4 - Frontend
```bash
cd frontend
npm run dev
```

## 📚 Documentation

Consultez le dossier [/docs](./docs/) pour la documentation complète :

### 🚀 Guides de Démarrage
- **[README](./docs/README.md)** - Point d'entrée de la documentation
- **[Installation](./docs/INSTALLATION.md)** - Setup complet développement local
- **[Fonctionnalités MVP](./docs/FEATURES_MVP.md)** - Features prioritaires et différenciateurs

### 🏗️ Architecture & Technique
- **[Architecture](./docs/ARCHITECTURE.md)** - Microservices, diagrammes, stack
- **[API](./docs/API.md)** - Endpoints Laravel, Python, WebSocket Node.js
- **[Base de Données](./docs/DATABASE.md)** - Schéma, tables, relations

### 📖 Guides Utilisateur & Déploiement
- **[Parcours Utilisateur](./docs/USER_JOURNEY.md)** - Flow complet de l'étudiant
- **[Déploiement](./docs/DEPLOYMENT.md)** - Guide production (VPS, Cloud)

## 🎯 URLs en locale 

- Frontend: http://localhost:5173
- Laravel API: http://localhost:8000
- Node WebSocket: http://localhost:3001
- Python IA: http://localhost:8001

## 👥 Équipe

- Hanna BIAOU - Frontend (React)
- Mourchid FOLARIN - Backend (Laravel)
- Octave BAHOUN-HOUTOUKPE - Backend (Node.js + Python IA)

---

Projet Hackathon 2 semaines 🔥
