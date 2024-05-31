import React, { Suspense, lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
import { AuthLayout } from "../components"
import { Spinner } from "../components"

const Home = lazy(() => import("../pages/Home"))
const Auth = lazy(() => import("../pages/Auth/Auth"))
const Logout = lazy(() => import("../pages/Logout"))

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthLayout authentication>
                <Suspense fallback={<Spinner loading />}>
                    <Home />
                </Suspense>
            </AuthLayout>
        ),
    },
    {
        path: "/auth/:type",
        element: (
            <AuthLayout authentication={false}>
                <Suspense fallback={<Spinner loading />}>
                    <Auth />
                </Suspense>
            </AuthLayout>
        ),
    },
    {
        path: "/auth/logout",
        element: (
            <AuthLayout authentication>
                <Suspense fallback={<Spinner loading />}>
                    <Logout />
                </Suspense>
            </AuthLayout>
        ),
    },
])

export { router }
