# EuroKredit — plateforme de demande de crédit

Application full-stack (marketing + espace client + console admin) pour la simulation
et le suivi de demandes de financement.

- **Backend** : FastAPI (Python), MongoDB, authentification JWT par cookies httpOnly.
- **Frontend** : React 19 + craco, Tailwind, shadcn/ui, framer-motion.
- **Emails** : SMTP standard (provider-agnostic), optionnel.
- **Zéro dépendance à une plateforme tierce** — déployable sur n'importe quel hébergeur.

---

## Fonctionnalités

- Site vitrine multilingue (FR/NL/DE/ES/PT/PL) + simulateur de crédit.
- Inscription / connexion client (JWT en cookies httpOnly, protection anti-bruteforce).
- Soumission de demandes de financement (avec ou sans compte).
- Espace client : suivi du dossier en 5 étapes (soumise → examen → pré-accord → contrat → décaissé).
- **Console admin** (`/admin`) : liste de toutes les demandes + avancement du statut, étape par étape.
- Emails de notification à chaque étape (si SMTP configuré).

---

## Option A — Démarrage rapide avec Docker (recommandé)

Prérequis : **Docker** + **Docker Compose**.

```bash
cd Credit-App
cp .env.docker.example .env
# éditez .env : mettez au minimum un JWT_SECRET fort
#   python -c "import secrets; print(secrets.token_urlsafe(48))"
docker compose up -d --build
```

- Application : **http://localhost:8080**
- Compte admin par défaut : `admin@eurokredit.fr` / `Admin2026!` (modifiable dans `.env`).

MongoDB, le backend et le frontend (servi par nginx, qui proxifie `/api` vers le backend)
tournent en conteneurs. Tout est same-origin → les cookies d'auth fonctionnent en HTTP local.

Arrêter : `docker compose down` (les données Mongo sont conservées dans le volume `mongo_data`).

---

## Option B — Développement local (hot reload)

Prérequis : **Python 3.12+**, **Node 18+**, et une **MongoDB** accessible.
Le plus simple pour Mongo : `docker run -d -p 27017:27017 --name ek-mongo mongo:7`.

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows : venv\Scripts\activate     |  macOS/Linux : source venv/bin/activate
pip install -r requirements.txt
# le fichier .env est déjà fourni pour le dev local (MONGO_URL=mongodb://localhost:27017)
python server.py
```

API sur **http://localhost:8001** (RELOAD=true dans `.env`).

### 2. Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

Application sur **http://localhost:3000** (proxy vers l'API via `REACT_APP_BACKEND_URL`).

---

## Option C — Natif sans Docker (utile si Docker/disque pose problème)

Cette voie n'utilise **ni Docker ni MongoDB local** : la base est hébergée gratuitement
sur **MongoDB Atlas**, et des scripts relocalisent `venv` / `node_modules` / caches sur le
disque de votre choix (pratique si le disque du projet est plein). Prérequis : **Python 3.13**
et **Node 18+** (déjà présents sur cette machine).

### 1. Base de données — MongoDB Atlas (gratuit, 2 min)

1. Créez un cluster gratuit sur https://www.mongodb.com/cloud/atlas (tier M0).
2. **Database Access** → créez un utilisateur (login + mot de passe).
3. **Network Access** → autorisez votre IP (ou `0.0.0.0/0` pour tester).
4. **Connect → Drivers** → copiez l'URI `mongodb+srv://...`.
5. Collez-le dans `backend/.env` → `MONGO_URL=...` (voir l'exemple commenté dans le fichier).

### 2. Backend (API sur :8001)

```powershell
# Depuis Credit-App\ — le venv et le cache pip vont sur C: (hors du projet)
powershell -ExecutionPolicy Bypass -File scripts\dev-backend.ps1
# Autre disque : -VenvPath D:\ek-venv    |    Relancer sans réinstaller : -SkipInstall
```

### 3. Frontend (app sur :3000)

```powershell
# node_modules est relocalisé hors du projet via une jonction (aucun admin requis)
powershell -ExecutionPolicy Bypass -File scripts\dev-frontend.ps1
# Autre disque : -NodeModulesPath D:\ek-node_modules
# Garder node_modules dans le projet : -NoRelocate    |    Sans réinstaller : -SkipInstall
```

Ouvrez **http://localhost:3000**. Le frontend appelle l'API via `REACT_APP_BACKEND_URL`
(déjà réglé sur `http://localhost:8001` dans `frontend/.env`), et le backend autorise cette
origine (CORS) avec des cookies non-secure/lax adaptés au HTTP local.

> **Espace disque** : même en natif, `node_modules` (~0,6 Go) + `venv` (~0,3 Go) + caches
> nécessitent ~1,5 à 2 Go libres sur le disque cible. Les scripts les placent par défaut sur
> `C:`. Si `C:` est aussi trop plein, passez `-VenvPath`/`-NodeModulesPath` vers un disque
> ayant de la place, ou libérez de l'espace au préalable.

---

## Configuration (variables d'environnement)

### Backend (`backend/.env` — voir `backend/.env.example`)

| Variable | Requis | Rôle |
|---|---|---|
| `MONGO_URL` | ✅ | URL de connexion MongoDB |
| `DB_NAME` | ✅ | Nom de la base |
| `JWT_SECRET` | ✅ | Secret de signature des jetons (long & aléatoire) |
| `COOKIE_SECURE` | | `true` en HTTPS, `false` en HTTP local |
| `COOKIE_SAMESITE` | | `lax` (same-origin) ou `none` (cross-site HTTPS) |
| `CORS_ORIGINS` | | Origines frontend autorisées (séparées par des virgules) |
| `FRONTEND_URL` | | URL utilisée dans les liens des emails |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | | Compte admin créé au démarrage |
| `SMTP_*` | | Config email — voir ci-dessous (optionnel) |

### Frontend (`frontend/.env` — voir `frontend/.env.example`)

| Variable | Rôle |
|---|---|
| `REACT_APP_BACKEND_URL` | URL du backend. **Vide** en prod same-origin (appel relatif `/api`), `http://localhost:8001` en dev. Injectée au **build**. |

---

## Emails (SMTP, optionnel)

Sans `SMTP_HOST`, l'envoi d'emails est **désactivé** (l'app fonctionne à 100 %, les envois
sont simplement ignorés et journalisés). Pour activer, renseignez les variables `SMTP_*`.
Compatible avec tout fournisseur SMTP (Brevo, Mailgun, SendGrid, Amazon SES, Gmail…).

Exemple (Brevo) :
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=votre_login
SMTP_PASSWORD=votre_cle
SMTP_FROM=no-reply@votre-domaine.fr
SMTP_STARTTLS=true
```

---

## Déploiement en production

1. Servez l'app en **HTTPS** (reverse-proxy / load-balancer devant, ou certificats sur nginx).
2. Dans `.env` (compose) : `PUBLIC_URL=https://votre-domaine.fr`, `COOKIE_SECURE=true`,
   un `JWT_SECRET` fort, et un `ADMIN_PASSWORD` personnalisé.
3. `docker compose up -d --build`.
4. Pour une MongoDB managée (Atlas…), remplacez le service `mongo` par votre `MONGO_URL`.

L'application ne dépend d'aucun service propriétaire : n'importe quel hébergeur supportant
Docker (VPS, Railway, Render, Fly.io, ECS…) convient.

---

## API (routes principales, préfixe `/api`)

| Méthode | Route | Accès |
|---|---|---|
| GET | `/api/rates`, POST `/api/simulator` | public |
| POST | `/api/contact` | public |
| POST | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh` | public |
| GET | `/api/auth/me` | authentifié |
| POST | `/api/applications` | public (rattaché au compte si connecté) |
| GET | `/api/applications/me` | authentifié |
| GET | `/api/applications/{id}` | propriétaire ou admin |
| GET | `/api/applications` | admin |
| PATCH | `/api/applications/{id}/step` | admin |
