import { z } from "zod"

const MAX_IMAGE_SIZE = 1024 * 1024 * 2
const ACCEPTABLE_IMAGE_FORMATS = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
]

export const imageValidationSchema = z
    .instanceof(File, {
        message: "Invalid avatar",
    })
    .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, {
        message: "Uploaded image should be 2mb max",
    })
    .refine((file) => ACCEPTABLE_IMAGE_FORMATS.includes(file.type), {
        message: "Only JPG, JPEG, PNG and WEBP formats are supported",
    })
