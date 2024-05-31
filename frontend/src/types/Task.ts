import { User } from "@/components/navbar/nav-types"

export interface Task {
    _id: string
    title: string
    description: string
    is_edited: boolean
    is_completed: boolean
    created_by: User
}
