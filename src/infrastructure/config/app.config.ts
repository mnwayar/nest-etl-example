export const AppConfig = () => ({
  api: {
    port: parseInt(process.env.API_PORT ?? '3000', 10),
  },
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    name: process.env.DATABASE_NAME ?? 'etl_db',
    user: {
      name: process.env.DATABASE_USER ?? 'etl_user',
      password: process.env.DATABASE_PASSWORD ?? 'etl_pass',
    },
  },
  hubspot: {
    baseUrl:
      process.env.HUBSPOT_BASE_URL ?? 'https://api.hubapi.com/crm/objects/v3/',
    token: process.env.HUBSPOT_TOKEN ?? '',
    limit: parseInt(process.env.HUBSPOT_LIMIT ?? '10', 10),
    batchSize: parseInt(process.env.HUBSPOT_BATCH_SIZE ?? '1000', 10),
  },
});
