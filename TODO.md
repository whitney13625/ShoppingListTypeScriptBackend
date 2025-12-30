# TODO List for Shopping List Backend Project

This document outlines the tasks required to complete the Shopping List Backend project. It is based on the provided file structure and content.

## General Setup

- [X] Create a new project directory.
- [X] Initialize a new npm project (`npm init -y`).
- [X] Create `.gitignore` file and exclude `node_modules`, `.env` and other unnecessary files.

## Docker Configuration

- [X] Create `Dockerfile` for containerizing the application (refer to `./Dockerfile`).
- [X] Create `docker-compose.yml` for orchestrating the application and database (refer to `./docker-compose.yml`).
- [X] Ensure the application connects to the database using the service name defined in `docker-compose.yml` (`DB_HOST: db`).
- [X]] Test Docker setup by building and running the containers (`docker-compose up --build`).

## Project Structure

- [X] Create `src` directory for source code.
- [X] Create `src/app.ts` and `src/server.ts` (main entry point).
- [X] Create `src/controllers` directory and add `shoppingController.ts`.
- [X] Create `src/data` directory and add `shoppingStorage.ts`.
- [X] Create `src/middleware` directory and add `zodValidation.ts`.
- [X] Create `src/schemas` directory and add `shoppingSchemas.ts`.
- [X] Create `src/config` directory and add `database.ts`.
- [X] Create `src/routes` directory and add `shoppingRoutes.ts`.
- [X] Create `src/db` directory and add `migrate.ts`.
- [X] Create `src/db/migrations` directory and add `001_create_shopping_items.sql`.

## Dependencies

- [X] Install required dependencies.

## Configuration

- [X] Create a `.env` file (if not already created) in the project root directory. 
- [X] Define database connection environment variables. 

## Database Migrations

- [X] Configure the database connection pool (in `src/config/database.ts`) using environment variables.
- [X] Implement the database migration script (`src/db/migrate.ts`) to create the `shopping_items` table (refer to `src/db/migrations/001_create_shopping_items.sql`).
- [X] Run the migration script: `npm run migrate` (defined in `package.json`).
- [X] Verify the `shopping_items` table is created in the PostgreSQL database. 

## API Endpoints

- [X] Implement the following API endpoints (in `src/controllers/shoppingController.ts`):
    - [X] `GET /api/shopping` - Get all shopping items (with pagination, filtering, and searching).
        - [X]  Apply the filters if provided in the url query
        - [X]  Apply search if provided in the url query
        - [X]  Verify that page and limit are provided in the query url
        - [X]  Paginate the results using the page and limit parameters
    - [X] `GET /api/shopping/:id` - Get item by ID.
    - [X] `POST /api/shopping` - Create item.
    - [X] `PUT /api/shopping/:id` - Update item.
    - [X] `DELETE /api/shopping/:id` - Delete item.
- [X] Define routes for the API endpoints (in `src/routes/shoppingRoutes.ts`).

## Data Access

- [X] Implement data access logic using PostgreSQL (in `src/data/shoppingStorage.ts`).
    - [X] Implement `getAll` function
    - [X] Implement `getById` function
    - [X] Implement `create` function
    - [X] Implement `update` function
    - [X] Implement `delete` function
    - [X] Implement `clear` function

## Validation

- [X] Implement Zod schemas (in `src/schemas/shoppingSchemas.ts`) for:
    - [X] `ShoppingItem` (full item schema).
    - [X] `CreateShoppingItemDto` (schema for creating new item).
    - [X] `UpdateShoppingItemDto` (schema for updating item).
    - [X] `GetAllItemsQuerySchema` (schema for query parameters - GET /api/shopping).
    - [X] `ItemIdParamsSchema` (schema for URL parameters with ID).
- [X] Implement validation middleware (in `src/middleware/zodValidation.ts`).
- [X] Apply the validation middleware to the API routes (in `src/routes/shoppingRoutes.ts`).

## Testing

- [ ] Implement tests (using Vitest).
- [ ] Test the API endpoints to ensure they function correctly. (Partially done)
- [ ] Test the validation middleware to ensure it properly validates requests. (Not done)
- [ ] Implement Unit Tests for Storage functions. (Not done)

## Error Handling

- [X] Implement global error handling. (Partially done for 404)
- [X] Properly handle database connection errors.
- [ ] Return appropriate HTTP status codes for errors (400, 404, 500, etc.). (Partially done)
- [ ] Include error messages in the response bodies. (Partially done)

## CORS

- [X] Configure CORS (in `src/app.ts`) to allow requests from the frontend (if needed).

## Documentation

- [X] Document the API endpoints and their parameters (using Swagger or similar tool).
- [ ] Add comments to the code. (Partially done)

## Server Setup

- [X] Setup the Express server and listen on the defined port.
- [X] Test the server endpoint
```
curl -X GET http://localhost:3000/ping
```
- [X] Verify the server console logs