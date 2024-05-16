import { migrate } from 'drizzle-orm/neon-http/migrator'

import '@/envConfig'
import db from '@/lib/db'

const program = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migration completed");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

void program();