import React from 'react'
import { Navbar } from '../components'
import { useSelector } from 'react-redux'
import { RootState } from "../store/store"


const Home: React.FC = () => {
	const user = useSelector((state: RootState) => state.auth.user)

	return (
		<div className='mx-[10%] my-[1%]'>
			<Navbar user={user} />
			Home
		</div>
	)
}

export default Home
