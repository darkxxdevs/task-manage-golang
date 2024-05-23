import { z } from "zod"
import { imageValidationSchema } from "./image"

const usernameValidation = z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, {
        message: "invalid username",
    })

export const SingnUpDataSchema = z.object({
    name: usernameValidation,
    email: z
        .string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
            message: "Please enter a valid email",
        }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message: "Invalid password",
            }
        ),
    avatar: imageValidationSchema,
})
