// run-migration.js
const { Client } = require('pg');

const sql = `
ALTER TABLE auth_users
ADD COLUMN IF NOT EXISTS username text;

CREATE UNIQUE INDEX IF NOT EXISTS auth_users_username_unique
ON auth_users ((lower(username)))
WHERE username IS NOT NULL;
`;

async function main() {
  const conn = process.env.DATABASE_URL;
  if (!conn) {
    console.error('Please set DATABASE_URL environment variable');
    process.exit(1);
  }
  const client = new Client({ connectionString: conn });
  try {
    await client.connect();
    console.log('Connected; running migration...');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migration applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    try { await client.query('ROLLBACK'); } catch (e) {}
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
