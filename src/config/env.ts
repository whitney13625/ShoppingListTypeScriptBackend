import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  DATABASE_URL: z.string().url(),
  PORT: z.string().default("3000"),
});

// parese and validate env variables
const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error("❌ Invalid environment variables:", envServer.error.format());
  process.exit(1); // if validation fails, exit the application
}

export const env = envServer.data;