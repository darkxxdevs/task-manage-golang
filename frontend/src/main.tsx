import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store'
import { router } from './config'
import "./config/axios.config"



ReactDOM.createRoot(document.getElementById('root')!).render(

	<React.StrictMode>
		<Provider store={store}>
			<div className="continer h-[100vh] mx-auto sm:max-w-full md:max-w-[70%] ">
				<RouterProvider router={router} />
			</div>
		</Provider>
	</React.StrictMode>,
)
