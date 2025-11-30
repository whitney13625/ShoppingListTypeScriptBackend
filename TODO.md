# TODO List for Shopping List Backend Project

This document outlines the tasks required to complete the Shopping List Backend project. It is based on the provided file structure and content.

## General Setup

- [ ] Create a new project directory.
- [ ] Initialize a new npm project (`npm init -y`).
- [ ] Create `.gitignore` file and exclude `node_modules`, `.env` and other unnecessary files.

## Docker Configuration

- [ ] Create `Dockerfile` for containerizing the application (refer to `./Dockerfile`).
- [ ] Create `docker-compose.yml` for orchestrating the application and database (refer to `./docker-compose.yml`).
- [ ] Ensure the application connects to the database using the service name defined in `docker-compose.yml` (`DB_HOST: db`).
- [ ] Test Docker setup by building and running the containers (`docker-compose up --build`).

## Project Structure

- [ ] Create `src` directory for source code.
- [ ] Create `src/index.ts` (main entry point - refer to `./src/index.ts`).
- [ ] Create `src/controllers` directory and add `shoppingController.ts` (refer to `./src/controllers/shoppingController.ts`).
- [ ] Create `src/data` directory and add `storage.ts` (PostgreSQL implementation - refer to `./src/data/storage.ts`). Consider moving the in-memory version to a separate file for testing.
- [ ] Create `src/middleware` directory and add `zodValidation.ts` (refer to `./src/middleware/zodValidation.ts`).
- [ ] Create `src/schemas` directory and add `shoppingSchemas.ts` (refer to `./src/schemas/shoppingSchemas.ts`).
- [ ] Create `src/config` directory and add `database.ts` (PostgreSQL connection setup - refer to `./src/config/database.ts`).
- [ ] Create `src/routes` directory and add `shoppingRoutes.ts` (refer to `./src/routes/shoppingRoutes.ts`).
- [ ] Create `src/db` directory and add `migrate.ts` (database migration script - refer to `./src/db/migrate.ts`).
- [ ] Create `src/db/migrations` directory and add `001_create_shopping_items.sql` (SQL script for creating the shopping items table - refer to `./src/db/migrations/001_create_shopping_items.sql`).

## Dependencies

- [ ] Install required dependencies:
    ```bash
    npm install dotenv express express-validator pg uuid zod
    npm install -D @types/express @types/express-validator @types/node @types/pg @types/uuid ts-node-dev tsx typescript
    ```
    (Based on `package.json`).

## Configuration

- [ ] Create a `.env` file (if not already created) in the project root directory.
- [ ] Define database connection environment variables:
    ```
    DB_HOST=db
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=mypassword
    DB_NAME=shopping_list
    PORT=3000
    ```
    (Refer to `docker-compose.yml` and `src/config/database.ts`).

## Database Migrations

- [ ] Configure the database connection pool (in `src/config/database.ts`) using environment variables.
- [ ] Implement the database migration script (`src/db/migrate.ts`) to create the `shopping_items` table (refer to `src/db/migrations/001_create_shopping_items.sql`).
- [ ] Run the migration script: `npm run migrate` (defined in `package.json`).
- [ ] Verify the `shopping_items` table is created in the PostgreSQL database.

## API Endpoints

- [ ] Implement the following API endpoints (in `src/controllers/shoppingController.ts`):
    - [ ] `GET /api/shopping` - Get all shopping items (with pagination, filtering, and searching).
        - [ ]  Apply the filters if provided in the url query
        - [ ]  Apply search if provided in the url query
        - [ ]  Verify that page and limit are provided in the query url
        - [ ]  Paginate the results using the page and limit parameters
    - [ ] `GET /api/shopping/:id` - Get item by ID.
    - [ ] `POST /api/shopping` - Create item.
    - [ ] `PUT /api/shopping/:id` - Update item.
    - [ ] `DELETE /api/shopping/:id` - Delete item.
- [ ] Define routes for the API endpoints (in `src/routes/shoppingRoutes.ts`).

## Data Access

- [ ] Implement data access logic using PostgreSQL (in `src/data/storage.ts`).
    - [ ] Implement `getAll` function
    - [ ] Implement `getById` function
    - [ ] Implement `create` function
    - [ ] Implement `update` function
    - [ ] Implement `delete` function
    - [ ] Implement `clear` function

## Validation

- [ ] Implement Zod schemas (in `src/schemas/shoppingSchemas.ts`) for:
    - [ ] `ShoppingItem` (full item schema).
    - [ ] `CreateShoppingItemDto` (schema for creating new item).
    - [ ] `UpdateShoppingItemDto` (schema for updating item).
    - [ ] `GetAllItemsQuerySchema` (schema for query parameters - GET /api/shopping).
    - [ ] `ItemIdParamsSchema` (schema for URL parameters with ID).
- [ ] Implement validation middleware (in `src/middleware/zodValidation.ts`) to validate request bodies, query parameters, and URL parameters.
- [ ] Apply the validation middleware to the API routes (in `src/routes/shoppingRoutes.ts`).

## Testing

- [ ] Implement tests (using Jest or similar framework).
- [ ] Test the API endpoints to ensure they function correctly.
- [ ] Test the validation middleware to ensure it properly validates requests.
- [ ] Implement Unit Tests for Storage functions

## Error Handling

- [ ] Implement global error handling.
- [ ] Properly handle database connection errors.
- [ ] Return appropriate HTTP status codes for errors (400, 404, 500, etc.).
- [ ] Include error messages in the response bodies.

## CORS

- [ ] Configure CORS (in `src/index.ts`) to allow requests from the frontend (if needed).

## Documentation

- [ ] Document the API endpoints and their parameters (using Swagger or similar tool).
- [ ] Add comments to the code.

## Server Setup

- [ ] Setup the Express server and listen on the defined port.
- [ ] Test the server endpoint
```
curl -X GET http://localhost:3000/ping
```
- [ ] Verify the server console logs

This TODO list provides a comprehensive overview of the tasks required to build the Shopping List Backend project.  Ensure to break down larger tasks into smaller, manageable sub-tasks.
```
