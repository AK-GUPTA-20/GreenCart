import React from 'react';
import { useAppContext } from '../context/AppContext';
import { auth, provider } from '../Firebase';
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Link, Navigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = React.useState('login');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser({ name: user.displayName, email: user.email });
      setShowUserLogin(false);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert('Something went wrong with Google Sign-In');
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(`/api/user/${state}`, { name ,email, password });
      if (data.success) {
        navigate('/');
        setUser({ name: data.user.name, email: data.user.email });
        setShowUserLogin(false);
      } else {
        toast.error(error.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="animate-fadeIn flex flex-col gap-5 bg-white/60 backdrop-blur-md border border-green-200 shadow-2xl px-6 py-8 w-full max-w-sm rounded-xl"
      >
        <h2 className="text-center text-2xl font-semibold text-green-600">
          {state === 'login' ? 'Login' : 'Sign Up'} to <span className="font-bold">Green Cart</span>
        </h2>

        {state === 'register' && (
          <div className="relative w-full">
            <FaUser className="absolute top-3 left-3 text-green-500" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full pl-10 pr-3 py-2 rounded-md border border-green-500 outline-green-400 focus:ring-2 ring-green-300"
            />
          </div>
        )}

        <div className="relative w-full">
          <FiMail className="absolute top-3 left-3 text-green-500" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-green-500 outline-green-400 focus:ring-2 ring-green-300"
          />
        </div>

        <div className="relative w-full">
          <FiLock className="absolute top-3 left-3 text-green-500" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-green-500 outline-green-400 focus:ring-2 ring-green-300"
          />
        </div>

        <p className="text-sm text-center text-gray-600">
          {state === 'login' ? (
            <>
              Create an account?{' '}
              <span
                className="text-green-600 font-medium cursor-pointer hover:underline"
                onClick={() => setState('register')}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span
                className="text-green-600 font-medium cursor-pointer hover:underline"
                onClick={() => setState('login')}
              >
                Login
              </span>
            </>
          )}
        </p>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all w-full"
        >
          {state === 'register' ? 'Create Account' : 'Login'}
        </button>

      <Link to="/seller" onClick={()=> {setShowUserLogin(false)}} className="bg-green-600 hover:bg-green-700 text-center text-white py-2 rounded-md transition-all w-full">
          seller login
        </Link>




        <div className="flex items-center gap-2 text-sm text-black w-full">
          <hr className="flex-grow border-black" />
          OR
          <hr className="flex-grow border-black" />
        </div>

        <button
          type="button"
          onClick={googleSignIn}
          className="flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-green-50 transition-all text-gray-700 font-medium py-2 rounded-md w-full shadow-sm"
        >
          <FcGoogle size={20} /> Continue with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
