import { createDb } from "@applypilot/shared";

export const db = createDb(process.env.DATABASE_URL!);
