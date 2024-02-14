
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
	const nevigate = useNavigate()

	const buttonRouteChange = (route: string) => {
		nevigate(route)
	}

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	return (
		<div className="relative  bg-white border-b-2">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
				<div className="inline-flex items-center space-x-2">
					<span className="font-bold"><span className='text-stone-500 text-4xl'>O</span>rganico</span>
				</div>
				<div className="hidden grow items-start lg:flex">
				</div>
				<div className="hidden space-x-2 lg:block">
					<button
						type="button"
						className="rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-black hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
						onClick={() => buttonRouteChange("/auth/signup")}
					>
						Sign In
					</button>
					<button
						type="button"
						className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
						onClick={() => buttonRouteChange("/auth/login")}
					>
						Log In
					</button>
				</div>
				<div className="lg:hidden">
					<Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
				</div>
				{isMenuOpen && (
					<div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
						<div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
							<div className="px-5 pb-6 pt-5">
								<div className="flex items-center justify-between">
									<div className="inline-flex items-center space-x-2">
										<span className="font-bold"><span className='text-stone-500 text-4xl'>O</span>rganico</span>
									</div>
									<div className="-mr-2">
										<button
											type="button"
											onClick={toggleMenu}
											className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
										>
											<span className="sr-only">Close menu</span>
											<X className="h-6 w-6" aria-hidden="true" />
										</button>
									</div>
								</div>
								<div className="mt-6">
								</div>
								<div className="mt-2 space-y-2">
									<button
										type="button"
										className="w-full rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
									>
										Sign In
									</button>
									<button
										type="button"
										className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
									>
										Log In
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Navbar
