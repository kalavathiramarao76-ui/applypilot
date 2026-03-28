import { createDb } from "@zypply/shared";

export const db = createDb(process.env.DATABASE_URL!);
