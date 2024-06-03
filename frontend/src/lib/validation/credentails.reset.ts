import { z } from "zod"

const usernameValidation = z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, {
        message: "invalid username",
    })

const resetCredentialSchema = z
    .object({
        username: usernameValidation.optional().or(z.literal("")),
        email: z
            .string()
            .email({ message: "Please enter a valid email" })
            .optional()
            .or(z.literal("")),
    })
    .refine((data) => data.username !== "" || data.email !== "", {
        message: "At least one of username or email must be provided",
        path: ["username", "email"],
    })

export { resetCredentialSchema }
