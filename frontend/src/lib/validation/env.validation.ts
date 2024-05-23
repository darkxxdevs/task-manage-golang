import { z } from "zod"

const envSchema = z.object({
    VITE_SERVER_URL: z.string(),
})

const result = envSchema.safeParse(import.meta.env)

if (!result.success) {
    console.error(`Error occured while loading env variables : ${result.error}`)
    process.exit(1)
}

export const envVars = result.data
