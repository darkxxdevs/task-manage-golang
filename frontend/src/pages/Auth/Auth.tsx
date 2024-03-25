import React from "react"
import { useParams } from "react-router-dom"
import { Form } from "../../components"

const Auth: React.FC = () => {
    const { type } = useParams<{ type: string }>()

    return (
        <div className="w-ful  h-full mx-[1%] flex items-center justify-center ">
            {type && <Form type={type} />}
        </div>
    )
}

export default Auth
