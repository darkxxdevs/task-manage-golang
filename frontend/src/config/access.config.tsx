import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { RootState } from "../store/store"


const PublicRoute = ({ element }: { element: JSX.Element }): JSX.Element => {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

	console.log("AuthStatus", isAuthenticated)

	return isAuthenticated ? <Navigate to={"/"} /> : element
}

const PrivateRoute = ({ element }: { element: JSX.Element }): JSX.Element => {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

	console.log("AuthStatus", isAuthenticated)

	return isAuthenticated ? element : <Navigate to={"/auth/login"} />
}


export {
	PublicRoute,
	PrivateRoute
}

