import 'dotenv/config';
import { z } from 'zod';

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

const refinedSchema = envSchema.transform((data) => {
  // If already has DATABASE_URL, just use it
  if (data.DATABASE_URL) return { ...data, FINAL_DATABASE_URL: data.DATABASE_URL };

  // If it's a split format, construct it here
  const constructedUrl = `postgres://${data.DB_USER}:${data.DB_PASSWORD}@${data.DB_HOST}:${data.DB_PORT}/${data.DB_NAME}`;
  
  return {
    ...data,
    FINAL_DATABASE_URL: constructedUrl
  };
});


// parese and validate env variables, from now on can simply use process.env.FINAL_DATABASE_URL
//const envServer = refinedSchema.safeParse(process.env);

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error("❌ Invalid environment variables:", envServer.error.format());
  process.exit(1); // if validation fails, exit the application
}

export const env = envServer.data;