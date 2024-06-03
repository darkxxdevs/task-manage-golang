import { z } from "zod"
import { imageValidationSchema } from "@/lib/validation/image"

export const resetAvatarValidationSchema = z.object({
    newAvatar: imageValidationSchema.optional(),
})
