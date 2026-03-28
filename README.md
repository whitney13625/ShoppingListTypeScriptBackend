# Shopping List API

A RESTful backend API for managing shopping lists and categories, built with TypeScript, Express, and PostgreSQL. Features JWT-based authentication, Zod schema validation, and auto-generated OpenAPI documentation.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5
- **Database**: PostgreSQL (via `pg`)
- **Auth**: JWT (`jsonwebtoken`) + bcrypt
- **Validation**: Zod + express-validator
- **API Docs**: Swagger UI + `zod-to-openapi`
- **Testing**: Vitest + Supertest
- **Migration**: Custom SQL migration runner

## Project Structure

```
src/
├── app.ts                    # Express app setup
├── server.ts                 # Server entry point
├── config/
│   ├── database.ts           # DB connection pool
│   └── env.ts                # Env validation (Zod)
├── controllers/              # Route handlers
├── services/                 # Business logic
├── repositories/
│   ├── interfaces/           # Repository contracts
│   └── implementations/      # Postgres + in-memory impls
├── routes/                   # Express routers
├── schemas/                  # Zod schemas (request/response)
├── middleware/               # Auth, validation, error handling
├── utils/                    # JWT generation, auth helpers
├── errors/                   # Custom error classes
├── lib/                      # OpenAPI registry setup
└── db/
    └── migrations/           # SQL migration files
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or Docker)

### Environment Variables

Create a `.env` file in the project root. You can provide either a full connection URL or individual fields:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key

# Option A: connection URL
DATABASE_URL=postgresql://user:password@localhost:5432/shopping_list

# Option B: individual fields
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopping_list
DB_USER=postgres
DB_PASSWORD=mypassword
```

### Install & Run

```bash
npm install

# Run database migrations
npm run migrate

# Start development server (with hot reload)
npm run dev

# Build and start production server
npm run build
npm start
```

The server runs on `http://localhost:3000` by default.

### Docker Compose

To run the full stack (app + database) with Docker:

```bash
docker compose up
```

> Make sure your `.env` file is present — Docker Compose reads it for database credentials.

## API Endpoints

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new account |
| POST | `/api/auth/login` | Sign in and receive a JWT |

### Shopping Items

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/shopping` | Get all items |
| GET | `/api/shopping/:id` | Get a single item |
| POST | `/api/shopping` | Create a new item |
| PUT | `/api/shopping/:id` | Update an item |
| DELETE | `/api/shopping/:id` | Delete an item |

### Categories

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get a single category |
| POST | `/api/categories` | Create a category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

### Other

| Method | Path | Description |
|--------|------|-------------|
| GET | `/ping` | Health check |
| GET | `/api-docs` | Swagger UI |
| GET | `/api-docs.json` | Raw OpenAPI JSON |

## Testing

```bash
# Unit tests
npm test

# Integration tests (spins up a Docker Postgres container)
npm run test:integration

# Coverage report
npm run test:coverage
```

Integration tests require Docker to be running. The test database is managed via `docker-compose.test.yml` and torn down automatically after the run.

### CI

GitHub Actions runs integration tests on every push and pull request. Required repository secrets:

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB` (variable)

## Database Migrations

Migrations are plain SQL files in `src/db/migrations/`, run in filename order. The runner tracks which migrations have already been applied.

```bash
npm run migrate
```

Current migrations:
1. `001_create_shopping_items.sql` — shopping items table
2. `002_add_categories_table.sql` — categories table
3. `003_add_auth_tables.sql` — users table + user_id foreign keys on items/categories
