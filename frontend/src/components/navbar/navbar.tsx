import React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/ui/theme/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"

interface NavUserProps {
    username?: string
    avatar?: string
    email?: string
}

const NavBar: React.FC<NavUserProps> = (user) => {
    const navigator = useNavigate()

    return (
        <div className="nav flex justify-between items-center border-b-2 pb-3">
            <div className="logo">
                <span className="text-4xl text-gray-500">O</span>ganico
            </div>

            <div className="right flex items-center justify-center gap-3">
                <ModeToggle />
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none ">
                            <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>You</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-[10px]">
                            <DropdownMenuLabel>
                                {user.username}
                            </DropdownMenuLabel>
                            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigator("/auth/logout")}
                                className="text-red-500"
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    )
}

export default NavBar
