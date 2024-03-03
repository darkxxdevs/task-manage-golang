import { PrivateRoute, PublicRoute } from "./access.config"
import { createBrowserRouter } from "react-router-dom"
import { Home, Auth, Logout } from "../pages"


const router = createBrowserRouter([
	{
		path: "/",
		element: <PrivateRoute element={< Home />} />
	},
	{
		path: "/auth/:type",
		element: <PublicRoute element={
			<Auth />} />
	},
	{
		path: "/auth/logout",
		element: <PrivateRoute element={
			<Logout />} />
	}
])

export {
	router
}


