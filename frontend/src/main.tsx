import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./index.css"
import { Provider } from "react-redux"
import store from "./store/store"
import { router } from "./config"
import "./config/axios.config"
import { ThemeProvider } from "./components"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Provider store={store}>
                <div className="continer h-[100vh] mx-auto sm:max-w-full md:max-w-[80%] ">
                    <RouterProvider router={router} />
                </div>
            </Provider>
        </ThemeProvider>
    </React.StrictMode>
)
