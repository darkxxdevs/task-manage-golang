import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Home, Auth } from "./pages"

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />
	},
	{
		path: "/auth/:type",
		element: <Auth />
	}

])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<div className="continer h-[100vh] mx-auto sm:max-w-full md:max-w-[70%] ">
			<RouterProvider router={router} />
		</div>
	</React.StrictMode>,
)
