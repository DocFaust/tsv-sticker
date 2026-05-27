# TSV Oberpframmern – Sticker-Tauschbörse

Webapp zum Tauschen von Stickern aus dem TSV-Oberpframmern-Stickeralbum.

## Projektstruktur

```
tsv-sticker/
├── backend/    Spring Boot 3 + Gradle + H2
└── frontend/   React + TypeScript + Vite + Tailwind
```

## Schnellstart

### Mit Docker Compose (empfohlen)
```bash
docker compose up --build
# Frontend: http://localhost
# Backend:  http://localhost:8080
```

### Lokale Entwicklung (ohne Docker)
```bash
# Backend mit H2 In-Memory DB
cd backend
./gradlew bootRun --args='--spring.profiles.active=dev'
# → http://localhost:8080  |  H2-Konsole: http://localhost:8080/h2-console

# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## API-Endpunkte

| Methode | Pfad                        | Beschreibung                        |
|---------|-----------------------------|-------------------------------------|
| POST    | /api/users/login            | Registrieren / Einloggen            |
| GET     | /api/users/{id}             | Benutzerprofil abrufen              |
| PUT     | /api/users/{id}/stickers    | Stickerlisten aktualisieren         |
| GET     | /api/matches/{userId}       | Tauschpartner finden                |
| GET     | /api/users                  | Alle Benutzer (Admin-Übersicht)     |

## Features

- **Minimale Anmeldung**: Nur Nickname + E-Mail nötig
- **Doppelte Sticker**: Nummern eintragen, die man tauschen möchte
- **Fehlende Sticker**: Nummern eintragen, die man noch sucht
- **Matching**: Findet automatisch Tauschpartner
  - 🟢 **Gegenseitige Matches**: Beide profitieren vom Tausch
  - 🟡 **Einseitige Matches**: Nur eine Seite profitiert
- Sortierung: Gegenseitige Matches zuerst, dann nach Anzahl

## Datenbank

Produktiv läuft **PostgreSQL 16** in Docker. Zugangsdaten über Umgebungsvariablen:

| Variable | Standard (Docker) |
|---|---|
| `DB_URL` | `jdbc:postgresql://db:5432/stickerdb` |
| `DB_USER` | `sticker` |
| `DB_PASSWORD` | `sticker` |

Für lokale Entwicklung ohne Docker: Profil `dev` aktivieren → H2 In-Memory wird genutzt.

## Produktion

Für den produktiven Einsatz:
- Passwörter in `.env`-Datei auslagern und `docker-compose.yml` anpassen
- CORS-Origins in `CorsConfig.java` anpassen
- SSL/TLS vor Nginx schalten (z.B. Traefik oder Certbot)
