import { z } from "zod"

const taskvalidationSchema = z.object({
    title: z
        .string()
        .max(30, "title can be max 30 characters long")
        .min(5, "title should be minimum 5 characters "),
    description: z.string(),
})

export default taskvalidationSchema
