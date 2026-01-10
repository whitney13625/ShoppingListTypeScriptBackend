import 'dotenv/config';
import { z } from 'zod';
/*
const envSchema = z.object({
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  DATABASE_URL: z.url().optional(),
  PORT: z.string().default("3000"),
});
*/
const envSchema = z.object({

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

  DATABASE_URL: z.string().optional(),

  DB_HOST: z.string().optional(),
  DB_PORT: z.string().optional(),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
})
.refine((data) => {

  const hasUrl = !!data.DATABASE_URL;

  // 檢查是否有完整的 5 個 DB 欄位
  const hasFullDetails = !!(
    data.DB_HOST && 
    data.DB_PORT && 
    data.DB_NAME && 
    data.DB_USER && 
    data.DB_PASSWORD
  );

  return hasUrl || hasFullDetails;
}, {
  message: "Must provide DATABASE_URL, or the complete database info (HOST, PORT, NAME, USER, PASSWORD)",
  path: ["DATABASE_URL"] // Base the error on DATABASE_URL field
});
// parese and validate env variables
const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error("❌ Invalid environment variables:", envServer.error.format());
  process.exit(1); // if validation fails, exit the application
}

export const env = envServer.data;