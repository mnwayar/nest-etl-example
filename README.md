# HubSpot ETL Data Sync (NestJS + TypeORM)

## Project Overview

This repository contains a technical test / proof-of-concept ETL project built with NestJS, TypeScript, and TypeORM. It synchronizes key HubSpot CRM objects—contacts, companies, deals, and contact associations—into a local PostgreSQL database, exposing the normalized data through an HTTP API and a dedicated ETL runner. Every CRM object is persisted with its HubSpot `sourceId`, metadata (URL, created/updated timestamps), the full raw payload, and an `ACTIVE` or `ARCHIVED` status that mirrors HubSpot’s `archived` flag (archived records correspond to deleted or historically closed entities). Incremental sync jobs fetch newly updated records while dedicated archived jobs keep removed records in sync.

## Architecture

The codebase follows a Clean/Hexagonal style with strict separation of layers:

- **Core / Domain (`src/core/domain`)** – Pure entities (`Contact`, `Company`, `Deal`, `ContactAssociation`, `CrmSyncCheckpoint`) and repository interfaces (`CrmRepository`, `ContactRepository`, etc.). Domain objects extend the shared `CrmEntity` base to ensure every record carries HubSpot metadata and status helpers.
- **Core / Application (`src/core/application`)** – Use cases, ports, and mappers. Every HubSpot object has:
  - `Hubspot…Provider` ports that describe how to fetch raw data from HubSpot.
  - Mappers (e.g., `HubspotContactMapper`) that normalize HubSpot payloads into domain entities.
  - Use cases for listing, retrieving, and syncing data. `SyncHubspotEntityUseCase` supplies the template method for ETL flows: fetch raw batches, map to domain, persist through a `CrmRepository`, and optionally update checkpoints. Incremental jobs (`SyncHubspotUpdated*`) consult the shared `CrmSyncCheckpointRepository` to filter by `hs_lastmodifieddate` and record the last run time.
  - The contact-association sync adds batching logic, uses `ContactRepository.listSourceIdsUpdatedSince` to drive association reads, and persists via `ContactAssociationRepository`.
- **Infrastructure (`src/infrastructure`)** – Adapters that bind ports to real implementations:
  - `config/` exposes `AppConfig` (loads `.env` values) and `DatabaseConfig` (TypeORM factory).
  - `hubspot/` provides HTTP clients: `HubSpotService` abstracts pagination/error handling, `RestClientService` wraps `@nestjs/axios`, and concrete services (`hubspot-contact.service.ts`, etc.) implement each provider port.
  - `persistence/` implements repository ports with TypeORM. `…PersistenceModule` classes register `TypeOrmModule.forFeature` entities, repository implementations, and DI tokens. Entities and mappers reside under `persistence/typeorm`.
  - `etl/etl.module.ts` wires persistence modules together with HubSpot providers to expose all ETL use cases as injectable services.
- **Interface / HTTP (`src/interface/http`)** – Controllers, DTOs, and feature modules for the API surface. Each controller resolves a pair of use cases (list + get details) and serializes domain entities into Swagger-described DTOs. `EtlController` maps HTTP `POST /etl/hubspot/*` endpoints to the ETL use cases.
- **Apps (`apps/api`, `apps/etl-runner`)** – Two NestJS applications wrap the shared layers:
  - `api` bootstraps HTTP controllers, Swagger, validation, and the global exception filter.
  - `etl-runner` bootstraps `EtlModule` inside an application context and dispatches CLI commands for the different sync jobs.

### HubSpot providers and repositories

`HubspotModule` binds every `Hubspot…ProviderToken` to its corresponding service, which in turn extends `HubSpotService` to handle authenticated pagination, search filters, and error translation into `HubspotApiError`. Persistence adapters implement the `CrmRepository` contracts with bulk upserts on the unique `source_id` field, store normalized metadata (`sourceCreatedYear`, trimmed strings, normalized phones), and expose read models enriched with associations. The `contact_associations` repository resolves FK relationships to connect contacts with companies/deals.

### ETL flow in practice

A sync job such as `SyncHubspotUpdatedContactsUseCase` performs:

1. **beforeExecute:** read the last checkpoint (`CrmSyncCheckpointRepository`) and decide HubSpot search filters.
2. **fetchFromHubspot:** call the provider (which uses `RestClientService` and HubSpot APIs like `/crm/objects/v3/contacts/search`) with pagination and property lists.
3. **mapToDomain:** convert raw payloads via the mapper (trimming, normalizing, storing raw JSON).
4. **syncFromSource:** persistence repositories upsert the entities.
5. **afterExecute:** compute the newest `sourceUpdatedAt`, subtract a safety minute, and persist the checkpoint so the next run is incremental.

The same pattern applies to companies and deals, with dedicated flows for archived records (where `archived: true` is requested). Contact associations rely on a custom use case that batches contact IDs, calls HubSpot’s v4 association batch endpoints, maps the relationships, and upserts them with FK integrity.

## Folder Structure

```
.
├── apps/
│   ├── api/                  # Nest app exposing HTTP API + Swagger + filters
│   └── etl-runner/           # Nest application context for CLI ETL commands
├── src/
│   ├── core/
│   │   ├── domain/           # Entities & repository contracts (Clean domain layer)
│   │   └── application/      # Use cases, ports, HubSpot mappers & shared logic
│   ├── infrastructure/
│   │   ├── config/           # App + database configuration factories
│   │   ├── hubspot/          # Rest client & HubSpot provider adapters
│   │   ├── persistence/      # TypeORM entities, mappers, repositories, modules
│   │   └── etl/              # EtlModule bundling sync use cases
│   ├── interface/http/       # Controllers, DTOs, feature modules
│   └── shared/               # Cross-cutting helpers (errors, normalizers)
├── docker-compose.yml        # Local Postgres + app container definition
├── Dockerfile / Dockerfile.build
├── package.json              # Scripts (API/ETL start, ETL CLI, migrations, tests)
├── tsconfig*.json            # Compiler + path alias configuration
└── nest-cli.json             # Monorepo project definitions (`api`, `etl-runner`)
```

(TypeORM entities, migrations, and mappers live under `src/infrastructure/persistence/typeorm`, including `contact_associations`, `crm_sync_checkpoints`, and the generated migration `1763413681882-auto-migration.ts`.)

## Entities and Synchronization

| Entity                                                                                       | What it represents                                                                                              | Synced data                                                                                                                  | Notes                                                                                                                                                          |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Company` (`src/core/domain/companies/company.entity.ts`)                                    | A HubSpot company record normalized for local use.                                                              | Name, website domain, phone, city, country, industry, HubSpot URL, created/updated/archived timestamps, status, raw payload. | `contacts: CompanyContactSummary[]` is populated from the `contact_associations` table when fetching details.                                                  |
| `Contact` (`src/core/domain/contacts/contact.entity.ts`)                                     | HubSpot contacts with identity and engagement metadata.                                                         | Email, first/last name, normalized phone, HubSpot metadata, `sourceStatus`.                                                  | Maintains `companies` and `deals` summary arrays derived from associations.                                                                                    |
| `Deal` (`src/core/domain/deals/deal.entity.ts`)                                              | HubSpot deals/pipeline opportunities.                                                                           | Deal name, stage (`dealstage`), close date, amount, HubSpot metadata, raw payload.                                           | Includes `contacts` summary list to show involved contacts.                                                                                                    |
| `ContactAssociation` (`src/core/domain/associations/entities/contact-association.entity.ts`) | Many-to-many relationships between contacts and companies/deals.                                                | Contact `sourceId`, target `sourceId`, target type (`COMPANY` or `DEAL`), association type id/label/category.                | Persisted in the `contact_associations` table with unique `(contact_source_id, target_source_id, target_type)` and FK references to contact/company/deal rows. |
| `CrmSyncCheckpoint` (`src/core/domain/shared/entities/crm-sync-checkpoint.entity.ts`)        | Last-run metadata that enables incremental syncs per object type (`CONTACT`, `COMPANY`, `DEAL`, `ASSOCIATION`). | `objectType` and `lastRunAt`.                                                                                                | Stored in `crm_sync_checkpoints` so incremental jobs can filter HubSpot search queries by `hs_lastmodifieddate` and resume where they left off.                |

- **Active vs archived:** `CrmEntityStatus` is derived from HubSpot’s `archived` flag: `ACTIVE` when `archived` is false, `ARCHIVED` when records have been deleted or archived upstream. Dedicated archive jobs fetch HubSpot records using `archived=true` and persist them locally with `sourceStatus = 'ARCHIVED'`.
- **Associations:** `SyncHubspotContactAssociationsUseCase` batches contact IDs (default batch size 1,000, configurable by `HUBSPOT_BATCH_SIZE`), calls HubSpot’s v4 association batch endpoints for companies and deals, maps results via `HubspotContactAssociationMapper`, and upserts them. The `ContactTypeOrmRepository` exposes `listSourceIdsUpdatedSince` so association syncs can target recently modified contacts. When retrieving contacts/companies/deals, TypeORM relations hydrate the relevant association summaries.

## Apps: API vs ETL Runner

- **API (`apps/api`)**
  - Purpose: serve HTTP routes for listing entities, fetching details, and triggering ETL jobs through `EtlController`.
  - Runs with `npm run start:api` (or `start:api:dev` for live reload + `tsconfig-paths/register`).
  - Loads `ConfigModule`, `TypeOrmModule`, and `HttpModule`, exposes Swagger docs at `/api/docs` (JSON at `/api/docs-json`), and applies validation plus `GlobalHttpExceptionFilter` to map domain errors to HTTP responses.
  - Controllers serialize domain objects into DTOs defined under `src/interface/http/dtos`.
- **ETL Runner (`apps/etl-runner`)**
  - Purpose: execute ETL jobs via CLI (ideal for cron, workers, or debugging).
  - Runs with `npm run start:etl` (or `start:etl:dev` for watch mode), which bootstraps the Nest application context without HTTP.
  - `apps/etl-runner/src/main.ts` inspects `process.argv` to decide which sync use case to invoke (companies/contacts/deals updated vs archived, or associations). With no command it executes all syncs sequentially.
  - The compiled commands under `npm run etl:*` execute `dist/apps/etl-runner/src/main.js` with appropriate arguments—use these for production/after `npm run build`.

The separation keeps HTTP concerns isolated from batch processing while sharing the same core modules and DI graph.

## Running the Project

### Prerequisites

- Node.js 20+ (the Docker images and Nest CLI scripts assume Node 20, matching the `Dockerfile.build` base image).
- npm 10+ (installed with Node 20).
- PostgreSQL 16 (or compatible). A ready-to-use instance is provided via `docker-compose.yml`.
- HubSpot Private App token with scopes to read contacts, companies, deals, and associations.
- (Optional) Docker & Docker Compose v2 for containerized execution.

### Environment Variables

`ConfigModule` loads `.env.<NODE_ENV>` (default `.env.local`) and `.env`. Set at least:

| Key                                                                                     | Purpose                                               | Default                                               |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| `API_PORT`                                                                              | HTTP port for the API app                             | `3000`                                                |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD` | Connection info for the Nest/TypeORM runtime          | `localhost`, `5432`, `etl_db`, `etl_user`, `etl_pass` |
| `HUBSPOT_BASE_URL`                                                                      | Base URL for HubSpot CRM APIs                         | `https://api.hubapi.com/crm/objects/v3/`              |
| `HUBSPOT_TOKEN`                                                                         | HubSpot Private App token (required)                  | _none_                                                |
| `HUBSPOT_LIMIT`                                                                         | Default page size when fetching individual objects    | `10`                                                  |
| `HUBSPOT_BATCH_SIZE`                                                                    | Batch size for association syncs (contacts per batch) | `1000`                                                |

TypeORM CLI commands (`npm run migration:*`) read `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, and `DB_NAME` from `src/infrastructure/persistence/typeorm/data-source.ts`; set these or rely on their defaults.

Example `.env.local`:

```bash
API_PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=etl_db
DATABASE_USER=etl_user
DATABASE_PASSWORD=etl_pass

HUBSPOT_BASE_URL=https://api.hubapi.com/
HUBSPOT_TOKEN=pat-xxxxxxxx-xxxx-xxxx
HUBSPOT_LIMIT=100
HUBSPOT_BATCH_SIZE=500
```

### Local Setup Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start PostgreSQL** – Either run your own instance or use Docker:

   ```bash
   docker compose up -d db
   ```

   (The compose file provisions `etl_user`/`etl_pass` and database `etl_db`.)

3. **Run database migrations**

   ```bash
   npm run migration:run
   ```

   Ensure the `DB_*` environment variables match your Postgres instance.

4. **Build (optional but required for CLI `npm run etl:*` scripts)**

   ```bash
   npm run build
   ```

5. **Start the API app**

   ```bash
   npm run start:api          # production-like
   npm run start:api:dev      # watch mode with tsconfig-paths
   ```

   Visit `http://localhost:3000/api/docs` for Swagger UI once it boots.

6. **Start the ETL runner (watch mode)**

   ```bash
   npm run start:etl          # run default ETL (all jobs)
   npm run start:etl:dev      # watch mode
   ```

   Use CLI commands (next section) to run targeted syncs.

### Docker workflow

- `Dockerfile.build` performs `npm ci` + `npm run build` (CI-friendly).
- `Dockerfile` is a distroless runtime image that expects the locally built `dist/` and `node_modules/` directories. Build locally, then bring up the stack:

  ```bash
  npm ci
  npm run build
  docker compose up -d --build
  ```

  The `app` service exposes port 3000 and depends on the `db` service.

## ETL / CLI Commands

All scripts live in `package.json`:

| Command                             | Description                                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run start:etl`                 | Boots the ETL runner via Nest CLI (uses TypeScript sources, good for development).                                                                                                                      |
| `npm run start:etl:dev`             | Same as above but with `--watch` for iterative development.                                                                                                                                             |
| `npm run etl`                       | Executes the compiled ETL runner (`dist/.../main.js`) with no args → runs every sync sequentially (updated + archived for companies/contacts/deals, plus associations). Requires `npm run build` first. |
| `npm run etl:companies`             | Syncs **updated companies** (active records) via `SyncHubspotUpdatedCompaniesUseCase`. Applies incremental filters based on checkpoints.                                                                |
| `npm run etl:companies:deleted`     | Syncs **archived companies** (`archived=true` in HubSpot) via `SyncHubspotArchivedCompaniesUseCase`.                                                                                                    |
| `npm run etl:contacts`              | Syncs **updated contacts** via `SyncHubspotUpdatedContactsUseCase` with incremental `lastmodifieddate` filtering.                                                                                       |
| `npm run etl:contacts:deleted`      | Syncs **archived contacts** via `SyncHubspotArchivedContactsUseCase`.                                                                                                                                   |
| `npm run etl:deals`                 | Syncs **updated deals** via `SyncHubspotUpdatedDealsUseCase`, using checkpoints to track `hs_lastmodifieddate`.                                                                                         |
| `npm run etl:deals:deleted`         | Syncs **archived deals** via `SyncHubspotArchivedDealsUseCase`.                                                                                                                                         |
| `npm run etl:associations:contacts` | Runs `SyncHubspotContactAssociationsUseCase`, batching contact IDs and calling HubSpot’s associations APIs to refresh contact ↔ company/deal relationships.                                            |

Each job logs its progress through Nest’s `Logger`, surfaces HubSpot errors via `HubspotApiError`, and stops with a non-zero exit code if a failure occurs (see `apps/etl-runner/src/main.ts`).

## API Endpoints (High-level)

The API app exposes simple RESTful endpoints documented via Swagger:

| Method & Route                         | Description                                            |
| -------------------------------------- | ------------------------------------------------------ |
| `GET /companies`                       | Returns all companies with base profile fields.        |
| `GET /companies/:id`                   | Returns a company plus associated contacts.            |
| `GET /contacts`                        | Returns all contacts with identity fields.             |
| `GET /contacts/:id`                    | Returns a contact plus associated companies and deals. |
| `GET /deals`                           | Returns all deals with pipeline data.                  |
| `GET /deals/:id`                       | Returns a deal plus associated contacts.               |
| `POST /etl/hubspot/companies`          | Triggers updated-company sync.                         |
| `POST /etl/hubspot/companies/archived` | Triggers archived-company sync.                        |
| `POST /etl/hubspot/contacts`           | Triggers updated-contact sync.                         |
| `POST /etl/hubspot/contacts/archived`  | Triggers archived-contact sync.                        |
| `POST /etl/hubspot/deals`              | Triggers updated-deal sync.                            |
| `POST /etl/hubspot/deals/archived`     | Triggers archived-deal sync.                           |
| `POST /etl/hubspot/associations`       | Triggers contact association sync.                     |

Swagger UI is served at `/api/docs`, and the raw OpenAPI spec is available at `/api/docs-json`.

## Error Handling & Logging

- `apps/api/src/common/filters/global-http-exception.filter.ts` centralizes error translation. Domain errors (`NotFoundError`, `ConflictError`, `HubspotApiError`, `InfrastructureError`, generic `AppError`) map to meaningful HTTP status codes/messages, while unexpected exceptions fall back to `500`.
- HubSpot REST calls go through `RestClientService`, which logs failed HTTP responses and raises an `HttpException`. `HubSpotService` wraps these errors, ensuring sync jobs receive `HubspotApiError` with the upstream status code.
- Use cases such as `SyncHubspotContactAssociationsUseCase` and the ETL runner main script use Nest’s `Logger` to denote start/end and per-batch progress, making ETL logs easy to follow.
- Infrastructure repositories catch persistence errors and wrap them in `InfrastructureError`, keeping the domain/application layers storage-agnostic.

## Testing

- Jest is configured via `jest.config.js`, with scripts:
  - `npm test` – run the whole test suite once.
  - `npm run test:watch` – watch mode.
  - `npm run test:cov` – coverage report.
- Existing tests cover:
  - Application use cases (`src/core/application/*/usecases/*.spec.ts`) to ensure detail use cases return correct data or throw `NotFoundError`.
  - Interface controllers (`src/interface/http/*/*.controller.spec.ts`) to verify DTO serialization and error bubbling.
- Additional unit/integration tests can follow the same structure under the relevant module directories.

## Conventions and Naming

- **Use case naming:** `<Verb><Entity><Context>UseCase` (e.g., `SyncHubspotUpdatedContactsUseCase`, `GetCompanyDetailsUseCase`) clarifies intent and entity.
- **DI tokens:** Repository/provider interfaces export `Symbol` tokens (`CompanyRepositoryToken`, `HubspotContactProviderToken`) to decouple layers.
- **Repositories:** Persistence adapters follow `XxxTypeOrmRepository` naming and implement the associated domain interface, with crude bulk upserts via TypeORM query builders keyed on `source_id`.
- **Modules:** Feature modules live in the layer they serve (`CompaniesPersistenceModule`, `CompaniesHttpModule`, `EtlModule`), making it explicit whether the module belongs to infrastructure or interface.
- **Active vs archived flows:** Updated vs archived jobs are separated both in naming and scripts (`sync-hubspot-updated-*.usecase.ts` vs `sync-hubspot-archived-*.usecase.ts`, CLI commands with `:deleted` suffix).
- **Shared helpers:** All string/date normalization happens via `src/shared/utils/normalizers.ts`, ensuring consistent trimming, casing, and phone formatting.
- **Path aliases:** `tsconfig.json` defines `@core/*`, `@infra/*`, `@interface/*`, `@shared/*`, used consistently throughout the repo.

This README should equip you to understand the project layout, configure the environment, run ETL jobs, and extend the system following its existing Clean Architecture conventions.
