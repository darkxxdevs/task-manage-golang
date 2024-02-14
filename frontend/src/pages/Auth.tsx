import React from "react";
import { useParams } from "react-router-dom";
import { Form } from "../components";


const Auth: React.FC = () => {
	const { type } = useParams()

	return (
		<div className="w-ful  h-full mx-[1%] flex items-center justify-center ">
			<Form type={type} />
		</div>
	)

}

export default Auth
