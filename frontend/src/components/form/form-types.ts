
export type SingupInputs = {
	username: string
	password: string
	email: string
	avatar: FileList
}

export type LoginInputs = {
	email: string
	password: string
}

export interface FormProps {
	type: 'login' | 'signup'
}

export type FormErrors = {
	email?: { message: string };
	password?: { message: string };
	username?: { message: string };
	avatar?: { message: string };
}

export type FormInputs = LoginInputs | SingupInputs
