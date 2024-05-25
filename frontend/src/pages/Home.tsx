import React from "react"
import { Navbar } from "../components"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import { Link } from "react-router-dom"

const Home: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user)

    return (
        <div className="mx-[10%] my-[1%]">
            <Navbar user={user as User} />
            Home
            <Link to={"/auth/logout"}>logout</Link>
        </div>
    )
}

export default Home
