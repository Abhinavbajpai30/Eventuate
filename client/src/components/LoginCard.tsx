import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginCard() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                toast.success('Login successful!');
                setTimeout(() => navigate('/profile'), 1000);
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (err) {
            toast.error('Network error');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <ToastContainer />
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Sign In to Eventuate</h2>
            <form onSubmit={handleSignIn}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email or Username</label>
                <input
                  type="text"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between mb-6">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                  Sign In
                </button>
              </div>
              <div className="text-center">
                <a href="#" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mr-4">
                  Forgot Password?
                </a>
                <NavLink to={"/signup"} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                  Don't have an account? Sign Up
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      );

}

export default LoginCard