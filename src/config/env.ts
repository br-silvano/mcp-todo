import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.string().default("8080"),
  API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
