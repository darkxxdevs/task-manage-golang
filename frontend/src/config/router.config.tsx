import { createBrowserRouter } from "react-router-dom"
import { Home, Auth, Logout } from "../pages"
import { AuthLayout } from "../components"

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthLayout authentication>
                <Home />
            </AuthLayout>
        ),
    },
    {
        path: "/auth/:type",
        element: (
            <AuthLayout authentication={false}>
                <Auth />
            </AuthLayout>
        ),
    },
    {
        path: "/auth/logout",
        element: (
            <AuthLayout authentication>
                <Logout />
            </AuthLayout>
        ),
    },
])

export { router }
