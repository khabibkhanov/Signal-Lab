import { defineConfig } from "prisma/config";

const fallbackDatabaseUrl =
	"postgresql://signal:signal@localhost:5432/signal_lab?schema=public";
const databaseUrl = process.env.DATABASE_URL ?? fallbackDatabaseUrl;

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: databaseUrl,
	},
});
