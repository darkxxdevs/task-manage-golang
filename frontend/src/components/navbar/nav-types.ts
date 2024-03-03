
export interface User {
	username: string
	avatar: string
	email?: string

}

export interface NavbarProps {
	user: User | null
}
