# HubSpot ETL Data Sync (NestJS + TypeORM)

## Project Overview

This repository contains a NestJS, TypeScript, and TypeORM proof-of-concept that mirrors key HubSpot CRM objects—contacts, companies, deals, and their associations—into PostgreSQL. The project exposes the normalized data through an HTTP API and a dedicated ETL runner. Every CRM object shares the same metadata model (`sourceId`, HubSpot URL, creation/update timestamps, archived flag translated to `sourceStatus`, and the full raw payload). Incremental jobs keep the local store synchronized by fetching only recently updated records while separate archived jobs capture deletions.

## Architecture

### Layered design

The codebase follows a clean/hexagonal style with strict separation of layers:

- **Core / Domain (`src/core/domain`)** – Pure entities and repository contracts. Domain objects extend the shared `CrmEntity` base to ensure HubSpot metadata, helpers for `ACTIVE`/`ARCHIVED` status, and association summaries are present everywhere.
- **Core / Application (`src/core/application`)** – Use cases, ports, and mappers. Each HubSpot object has:
  - Provider ports (`Hubspot…Provider`) that describe how data is fetched.
  - Mappers (for example `HubspotContactMapper`) that sanitize payloads into domain entities.
  - Use cases for list/detail queries plus sync flows. `SyncHubspotEntityUseCase` hosts the ETL template (fetch batches → map → persist → update checkpoints) and is reused by companies, contacts, and deals. Incremental jobs (`SyncHubspotUpdated*`) read/write checkpoints through `CrmSyncCheckpointRepository`.
  - A specialized contact-association sync that batches contact IDs via `ContactRepository.listSourceIdsUpdatedSince` before persisting through `ContactAssociationRepository`.
- **Infrastructure (`src/infrastructure`)** – Adapters that connect ports to real services:
  - `config/` exposes `AppConfig` and `DatabaseConfig`.
  - `hubspot/` contains HTTP clients (`RestClientService`, `HubSpotService`, concrete providers per entity) with pagination, authentication, and error translation (`HubspotApiError`).
  - `persistence/` implements TypeORM repositories, entities, mappers, and persistence modules. Each `…PersistenceModule` registers `TypeOrmModule.forFeature`, repository implementations, and DI tokens.
  - `etl/etl.module.ts` wires HubSpot providers with persistence modules so all ETL use cases can be injected anywhere.
- **Interface / HTTP (`src/interface/http`)** – Controllers, DTOs, and feature modules for the API surface. Controllers resolve list/detail use cases and serialize domain entities into Swagger-described DTOs. `EtlController` exposes HTTP triggers for each ETL job.

### Applications

Two NestJS applications reuse the shared layers:

- **`apps/api`** – Boots HTTP controllers, configuration, TypeORM, Swagger, validation, and the global exception filter.
- **`apps/etl-runner`** – Boots `EtlModule` inside an application context and dispatches CLI commands for each sync job. It can execute the whole sync suite or a targeted job.

### HubSpot providers and repositories

`HubspotModule` binds each `Hubspot…ProviderToken` to the corresponding service that extends `HubSpotService`. Providers handle authenticated pagination, search filters, backoff, and error wrapping. Persistence adapters implement the `CrmRepository` contracts with bulk upserts on the unique `source_id` column, normalize metadata (trim strings, compute `sourceCreatedYear`, normalize phones), and hydrate association summaries. The `contact_associations` repository ensures FK integrity across contacts, companies, and deals.

### ETL flow in practice

A sync job such as `SyncHubspotUpdatedContactsUseCase` performs:

1. **beforeExecute** – Read the last checkpoint from `CrmSyncCheckpointRepository`, compute HubSpot filters (typically `hs_lastmodifieddate`), and decide pagination settings.
2. **fetchFromHubspot** – Call the provider (which uses `RestClientService` + HubSpot APIs like `/crm/objects/v3/contacts/search`) until the batch finishes.
3. **mapToDomain** – Convert each payload through the mapper (trimming strings, normalizing phones, storing the raw JSON snapshot).
4. **syncFromSource** – Call the persistence repository to upsert records in bulk.
5. **afterExecute** – Persist a new checkpoint based on the newest `sourceUpdatedAt` (with a safety minute subtraction) so incremental runs resume precisely.

The same blueprint powers companies and deals, while dedicated archived jobs run with `archived=true`. Contact associations rely on a tailored use case that batches contact IDs (default 1,000, controlled by `HUBSPOT_BATCH_SIZE`), hits HubSpot’s v4 association endpoints for companies/deals, maps the relationships, and upserts them.

## Entities & Synchronization

| Entity                                                                                       | Description                                                                                                                         | Synced data                                                                                                                | Notes                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Company` (`src/core/domain/companies/company.entity.ts`)                                    | HubSpot company normalized for local use.                                                                                           | Name, domain, phone, city, country, industry, HubSpot metadata, archived status, raw payload.                              | `contacts: CompanyContactSummary[]` is populated via `contact_associations` when requesting details.                                                                    |
| `Contact` (`src/core/domain/contacts/contact.entity.ts`)                                     | Contacts enriched with identity and engagement metadata.                                                                            | Email, first/last name, normalized phone, metadata, archived status, raw payload.                                          | `companies` and `deals` summary arrays are resolved through associations.                                                                                               |
| `Deal` (`src/core/domain/deals/deal.entity.ts`)                                              | Deal/pipeline opportunities.                                                                                                        | Deal name, stage, close date, amount, metadata, archived status, raw payload.                                              | `contacts` summary list displays the involved contacts.                                                                                                                 |
| `ContactAssociation` (`src/core/domain/associations/entities/contact-association.entity.ts`) | Contact ↔ company/deal relationships.                                                                                               | Contact `sourceId`, target `sourceId`, target type (`COMPANY` or `DEAL`), association category/id/label.                   | Persisted with a unique `(contact_source_id, target_source_id, target_type)` constraint plus FK references to the contact/company/deal tables.                           |
| `CrmSyncCheckpoint` (`src/core/domain/shared/entities/crm-sync-checkpoint.entity.ts`)        | Last-run metadata that enables incremental syncs per object type (`CONTACT`, `COMPANY`, `DEAL`, `ASSOCIATION`).                      | `objectType` and `lastRunAt`.                                                                                              | Stored in `crm_sync_checkpoints`, so incremental jobs can filter HubSpot search queries by `hs_lastmodifieddate` and resume exactly where the previous execution ended. |

## Folder Structure

```
.
├── apps/
│   ├── api/                  # Nest app exposing HTTP API + Swagger + filters
│   └── etl-runner/           # Nest application context for CLI ETL commands
├── src/
│   ├── core/
│   │   ├── domain/           # Entities & repository contracts (clean domain layer)
│   │   └── application/      # Use cases, ports, HubSpot mappers & shared logic
│   ├── infrastructure/
│   │   ├── config/           # App + database configuration factories
│   │   ├── hubspot/          # REST client & HubSpot provider adapters
│   │   ├── persistence/      # TypeORM entities, mappers, repositories, modules
│   │   └── etl/              # EtlModule bundling sync use cases
│   ├── interface/http/       # Controllers, DTOs, feature modules
│   └── shared/               # Cross-cutting helpers (errors, normalizers)
├── docker-compose.yml        # Local Postgres + app container definition
├── Dockerfile                # Multi-stage build (build → distroless runtime)
├── package.json              # Scripts (API/ETL start, ETL CLI, migrations, tests)
├── tsconfig*.json            # Compiler + path alias configuration
└── nest-cli.json             # Monorepo project definitions (`api`, `etl-runner`)
```

## Configuration & Environment

`ConfigModule` loads `.env.<NODE_ENV>` (default `.env.local`) plus `.env`. Set at least:

| Key                                                                                     | Purpose                                               | Default                                               |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| `API_PORT`                                                                              | HTTP port for the API app                             | `3000`                                                |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD` | PostgreSQL connection info for runtime TypeORM        | `localhost`, `5432`, `etl_db`, `etl_user`, `etl_pass` |
| `HUBSPOT_BASE_URL`                                                                      | Base URL for HubSpot CRM APIs                         | `https://api.hubapi.com/crm/objects/v3/`              |
| `HUBSPOT_TOKEN`                                                                         | HubSpot Private App token (required)                  | _none_                                                |
| `HUBSPOT_LIMIT`                                                                         | Default page size for individual object fetches       | `10`                                                  |
| `HUBSPOT_BATCH_SIZE`                                                                    | Batch size for association syncs (contacts per batch) | `1000`                                                |

TypeORM CLI commands (`npm run migration:*`) use the values defined in `src/infrastructure/persistence/typeorm/data-source.ts` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`).

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

## Bootstrapping the Project

### Local setup (without Docker)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start PostgreSQL** – Use your own instance or start the compose service:

   ```bash
   docker compose up -d db
   ```

   Ensure the `DATABASE_*` or `DB_*` variables match the running instance.

3. **Run database migrations**

   ```bash
   npm run migration:run
   ```

4. **Start the API**

   ```bash
   npm run start:api          # production-like
   npm run start:api:dev      # watch mode with tsconfig-paths
   ```

5. (Optional) **Start the ETL runner in watch mode**

   ```bash
   npm run start:etl          # runs the default ETL suite
   npm run start:etl:dev      # runs with --watch
   ```

### Docker setup

1. **Bring up the stack**

   ```bash
   docker compose up -d
   ```

   The `api` service builds the image, runs migrations dependencies, and exposes port `3000`. The `db` service provisions PostgreSQL with `etl_user`/`etl_pass` and database `etl_db`.

2. **Run migrations inside the running API container**

   ```bash
   docker compose exec app npm run migration:run
   ```

3. **Run ETL commands on demand (per sync job)**

   ```bash
   docker compose run --rm etl-runner npm run etl:contacts
   ```

   Replace `etl:contacts` with any command listed in the ETL CLI section.

## Docker Workflow

The `Dockerfile` defines a multi-stage build:

1. **Build stage** – Uses `node:20-bookworm-slim` to install dependencies via `npm ci`, copy the source code, and execute `npm run build` (covering both apps).
2. **Runtime stage** – Uses the distroless `nodejs20-debian12` image and copies only `dist`, `node_modules`, and package manifests. The default `CMD` runs `dist/apps/api/main.js`.

`docker-compose.yml` always starts the API container (`app`/`api` service) as the main runtime. The ETL runner shares the same image but is executed on demand:

```bash
docker compose run --rm etl-runner npm run etl:<command>
```

This approach keeps the API always-on while letting you trigger targeted ETL jobs (updated vs archived objects, associations, or the aggregate sync) whenever needed.

## Swagger Documentation

Swagger is the source of truth for the HTTP contract. When the API is running locally, access:

- UI: `http://localhost:3000/api/docs`
- JSON: `http://localhost:3000/api/docs-json`

## ETL / CLI Commands

All commands live in `package.json` and can run locally or inside Docker (`docker compose run etl-runner npm run <command>`):

| Command                             | Description                                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run start:etl`                 | Boots the ETL runner via Nest CLI (TypeScript sources, good for development).                                                                                                                           |
| `npm run start:etl:dev`             | Same as above but with `--watch` for iterative work.                                                                                                                                                    |
| `npm run etl`                       | Executes the compiled ETL runner (`dist/.../main.js`) with no args → runs every sync sequentially (updated + archived for companies/contacts/deals, plus associations). Requires `npm run build` first. |
| `npm run etl:companies`             | Syncs **updated companies** via `SyncHubspotUpdatedCompaniesUseCase`, applying incremental checkpoints.                                                                                                 |
| `npm run etl:companies:deleted`     | Syncs **archived companies** (`archived=true`) via `SyncHubspotArchivedCompaniesUseCase`.                                                                                                               |
| `npm run etl:contacts`              | Syncs **updated contacts** via `SyncHubspotUpdatedContactsUseCase` with `hs_lastmodifieddate` filtering.                                                                                                |
| `npm run etl:contacts:deleted`      | Syncs **archived contacts** via `SyncHubspotArchivedContactsUseCase`.                                                                                                                                   |
| `npm run etl:deals`                 | Syncs **updated deals** via `SyncHubspotUpdatedDealsUseCase`, reusing the checkpoint store.                                                                                                             |
| `npm run etl:deals:deleted`         | Syncs **archived deals** via `SyncHubspotArchivedDealsUseCase`.                                                                                                                                         |
| `npm run etl:associations:contacts` | Runs `SyncHubspotContactAssociationsUseCase`, batching contact IDs and calling HubSpot’s association APIs to refresh contact ↔ company/deal relationships.                                             |

Each job logs through Nest’s `Logger`, raises `HubspotApiError` for upstream issues, and returns a non-zero exit code if anything fails (`apps/etl-runner/src/main.ts`).

## API Endpoints (high level)

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

## Error Handling & Logging

- `apps/api/src/common/filters/global-http-exception.filter.ts` converts domain/application errors (`NotFoundError`, `ConflictError`, `HubspotApiError`, `InfrastructureError`, generic `AppError`) into HTTP responses, falling back to `500` for unexpected issues.
- HubSpot REST calls go through `RestClientService`, which logs outbound requests, captures failed responses, and raises `HttpException`. `HubSpotService` wraps these errors so use cases receive normalized `HubspotApiError` objects.
- Use cases (including `SyncHubspotContactAssociationsUseCase`) and the ETL runner main script emit detailed logs via Nest’s `Logger` to trace progress batch by batch.
- Persistence adapters wrap TypeORM failures into `InfrastructureError`, keeping domain/application layers storage agnostic.

## Testing

- Jest is configured via `jest.config.js`, with scripts:
  - `npm test` – run the suite once.
  - `npm run test:watch` – watch mode.
  - `npm run test:cov` – coverage report.
- Existing specs act as examples that cover one representative use case (list/detail flows and a sample controller), showcasing how to test the clean architecture layers.
- Because responsibilities are isolated behind ports and DI tokens, adding more unit or integration tests is straightforward: mock provider/repository ports in application specs or wire real modules for integration tests.

## Conventions & Naming

- **Use case naming** – `<Verb><Entity><Context>UseCase` (e.g., `SyncHubspotUpdatedContactsUseCase`, `GetCompanyDetailsUseCase`) clarifies behavior and scope.
- **DI tokens** – Repository/provider interfaces export `Symbol` tokens (`CompanyRepositoryToken`, `HubspotContactProviderToken`) to decouple layers.
- **Repositories** – TypeORM adapters follow `XxxTypeOrmRepository`, implementing domain interfaces with bulk upserts keyed on `source_id`.
- **Modules** – Features live in their owning layer (`CompaniesPersistenceModule`, `CompaniesHttpModule`, `EtlModule`), making architecture boundaries explicit.
- **Active vs archived flows** – Updated vs archived jobs stay separate both in naming and CLI commands (`sync-hubspot-updated-*.usecase.ts` vs `sync-hubspot-archived-*.usecase.ts`, scripts with `:deleted` suffix).
- **Shared helpers** – String/date normalization logic lives in `src/shared/utils/normalizers.ts`, and path aliases (`@core/*`, `@infra/*`, `@interface/*`, `@shared/*`) keep imports concise.

This README should give you everything needed to configure the environment, run ETL jobs (locally or in Docker), consult the HTTP contract, and extend the system while respecting its clean architecture boundaries.
