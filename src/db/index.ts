import { drizzle } from 'drizzle-orm/neon-http';
import { schemaRelations } from './schema';

const db = drizzle(process.env.DATABASE_URL!, { relations: schemaRelations });

export {db};