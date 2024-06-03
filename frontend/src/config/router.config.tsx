import { Suspense, lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
import { AuthLayout } from "../components"
import { Spinner } from "../components"

const Home = lazy(() => import("../pages/Home"))
const Auth = lazy(() => import("../pages/Auth/Auth"))
const Logout = lazy(() => import("../pages/Logout"))
const Profile = lazy(() => import("../pages/profile"))
const ResetPasswd = lazy(() => import("../pages/reset/passwd"))
const ResetAvatar = lazy(() => import("../pages/reset/avatar"))
const ResetCredentials = lazy(() => import("../pages/reset/credentials"))

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
        path: "/u/profile",
        element: (
            <AuthLayout authentication>
                <Suspense fallback={<Spinner loading />}>
                    <Profile />
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
    {
        path: "/reset/passwd",
        element: (
            <AuthLayout authentication>
                <Suspense fallback={<Spinner loading />}>
                    <ResetPasswd />
                </Suspense>
            </AuthLayout>
        ),
    },

    {
        path: "/r/avatar",
        element: (
            <AuthLayout authentication>
                <Suspense fallback={<Spinner loading />}>
                    <ResetAvatar />
                </Suspense>
            </AuthLayout>
        ),
    },

    {
        path: "/r/credentails/:field?",
        element: (
            <AuthLayout authentication>
                <Suspense fallback={<Spinner loading />}>
                    <ResetCredentials />
                </Suspense>
            </AuthLayout>
        ),
    },
])

export { router }
