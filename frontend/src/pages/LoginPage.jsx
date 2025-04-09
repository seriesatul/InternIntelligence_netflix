import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import toast from "react-hot-toast";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const { login, isLoggingIn } = useAuthStore();

	const handleLogin = (e) => {
		e.preventDefault();
		setError("");
		
		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}

		login({ email, password }).catch(() => {
			setError("Login failed. Please try again.");
		});
	};

	return (
		<div className='h-screen w-full hero-bg'>
			<header className='max-w-6xl mx-auto flex items-center justify-between p-4'>
				<Link to={"/"}>
					<img src='/netflix-logo.png' alt='logo' className='w-52' />
				</Link>
			</header>

			<div className='flex justify-center items-center mt-20 mx-3'>
				<div className='w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md'>
					<h1 className='text-center text-white text-2xl font-bold mb-4'>Login</h1>

					<form className='space-y-4' onSubmit={handleLogin}>
						<div>
							<label htmlFor='email' className='text-sm font-medium text-gray-300 block'>
								Email
							</label>
							<input
								type='email'
								className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
								placeholder='you@example.com'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div>
							<label htmlFor='password' className='text-sm font-medium text-gray-300 block'>
								Password
							</label>
							<input
								type='password'
								className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
								placeholder='••••••••'
								id='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						{error && (
							<div className="text-red-500 text-sm text-center">
								{error}
							</div>
						)}
						<button
							className='w-full py-2 bg-red-600 text-white font-semibold rounded-md
							hover:bg-red-700 flex justify-center items-center gap-2'
							disabled={isLoggingIn}
						>
							{isLoggingIn ? (
								<>
									<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Loading...
								</>
							) : "Login"}
						</button>
					</form>
					<div className='text-center text-gray-400'>
						Don't have an account?{" "}
						<Link to={"/signup"} className='text-red-500 hover:underline'>
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;