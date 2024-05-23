import { z } from "zod"

export const loginDataSchema = z.object({
    email: z
        .string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
            message: "please enter a valid email",
        }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
            }
        ),
})
