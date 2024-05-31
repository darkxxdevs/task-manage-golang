export interface User {
    _id: string
    username: string
    avatar: string
    email?: string
}

export interface NavbarProps {
    user: User | null
}
