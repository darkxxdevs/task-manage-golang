import { jwtDecode } from "jwt-decode"

interface jwtPayload {
    exp: number
}

const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    if (match) {
        return match[2]
    }
    return null
}

const checkTokenExpiry = (key: string): boolean => {
    const token = localStorage.getItem(key)

    if (!token) return true

    try {
        const { exp } = jwtDecode<jwtPayload>(token)

        if (!exp || typeof exp !== "number") return true

        return Date.now() >= exp * 1000
    } catch (error) {
        console.error("Invalid token found", error)
        return true
    }
}

export { getCookie, checkTokenExpiry }
