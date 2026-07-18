# Smart Contact Manager — Web Edition

A REST API (Spring Boot) + minimalist frontend (HTML/CSS/JS) version of the
original console app.

```
smart-contact-manager/
├── backend/     Spring Boot REST API
└── frontend/    Static HTML/CSS/JS client
```

## Run the backend locally

Requires JDK 17+ and Maven (or use the Maven wrapper if your IDE generated one).

```bash
cd backend
mvn spring-boot:run
```

The API will be live at `http://localhost:8080/api/contacts`.
You can browse the H2 database at `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:contactsdb`, username: `sa`, no password).

## Run the frontend locally

No build step needed — just open `frontend/index.html` in a browser,
or serve it with any static server (e.g. VS Code's "Live Server" extension)
so it runs on `http://localhost:5500` (already whitelisted in CORS config).

## API Reference

| Method | Endpoint                        | Description              |
|--------|----------------------------------|---------------------------|
| POST   | /api/contacts                   | Add a contact             |
| GET    | /api/contacts                   | List all contacts         |
| GET    | /api/contacts?sortBy=name       | List, sorted by name      |
| GET    | /api/contacts/{id}               | Get one contact           |
| GET    | /api/contacts/search?name=John  | Search by name            |
| PUT    | /api/contacts/{id}                | Update a contact           |
| DELETE | /api/contacts/{id}                | Delete a contact           |

## Deploying to Render

### 1. Push to GitHub
Create a repo and push the `smart-contact-manager` folder (backend + frontend).

### 2. Create the database
On Render: **New → PostgreSQL** (free tier). Note the connection details
Render gives you — internal database URL, username, password.

### 3. Deploy the backend
**New → Web Service** → connect your repo.

- **Language:** Docker (Render's native runtime list doesn't include Java,
  so we deploy via the included `Dockerfile` instead — this is the standard
  way to run Spring Boot on Render).
- **Root Directory:** `backend` (this is where `Dockerfile` and `pom.xml` live)
- **Dockerfile Path:** `Dockerfile` (relative to the root directory above, so
  just the filename)
- Leave Build Command / Start Command blank — Docker handles both.

Set these environment variables in the Render dashboard:
- `SPRING_PROFILES_ACTIVE=prod`
- `DATABASE_URL` (from your Render Postgres instance, JDBC format:
  `jdbc:postgresql://<host>:<port>/<database>`)
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`

Render will build and give you a live URL like `https://scm-backend.onrender.com`.

### 4. Deploy the frontend
**New → Static Site** → connect the same repo → set root directory to
`frontend`, no build command needed (it's plain HTML/CSS/JS).

### 5. Connect them
- In `frontend/script.js`, change `API_BASE` to your live backend URL.
- In `backend/.../config/CorsConfig.java`, replace the placeholder origin
  with your live frontend URL.
- Commit, push, redeploy both.

Render's free tier spins down idle services — the first request after a
period of inactivity can take 30–60 seconds to wake up. That's expected.
