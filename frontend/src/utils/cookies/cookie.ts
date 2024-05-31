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

export { getCookie }
