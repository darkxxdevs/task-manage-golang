import { z } from "zod"

export const passwordResetDataSchema = z
    .object({
        newPassword: z.string().min(8).max(20),
        confirmPassword: z.string().min(8).max(20),
    })
    .refine((data) => data.newPassword === data.confirmPassword)
