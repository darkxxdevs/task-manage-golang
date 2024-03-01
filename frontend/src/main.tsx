import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import { Home, Auth, Logout } from "./pages"
import { useSelector, Provider } from 'react-redux'
import { RootState } from "./store/store"
import store from './store/store'


const PublicRoute = ({ element }: { element: JSX.Element }): JSX.Element => {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

	return isAuthenticated ? <Navigate to={"/"} /> : element
}

const PrivateRoute = ({ element }: { element: JSX.Element }): JSX.Element => {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

	return isAuthenticated ? element : <Navigate to={"/auth/login"} />
}


const router = createBrowserRouter([
	{
		path: "/",
		element: <PrivateRoute element={<Home />} />
	},
	{
		path: "/auth/:type",
		element: <PublicRoute element={<Auth />} />
	},
	{
		path: "/auth/logout",
		element: <PrivateRoute element={<Logout />} />
	}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<div className="continer h-[100vh] mx-auto sm:max-w-full md:max-w-[70%] ">
				<RouterProvider router={router} />
			</div>
		</Provider>
	</React.StrictMode>,
)
