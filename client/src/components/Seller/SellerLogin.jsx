import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const SellerLogin = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { isSeller, setIsSeller, navigate, axios } = useAppContext()

    const onSubmitHandler = async (event) => {
        if (!email || !password) {
            return toast.error("Email and password are required");
        }
        try {
            event.preventDefault();
            const { data } = await axios.post('/api/seller/login', { email, password })
            if (data.success) {
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                    setIsSeller(true);
                    console.log('Login successful!');
                    navigate('/seller');
                }, 2000);

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Login failed")
        }
    }

    useEffect(() => {
        if (isSeller) {
            navigate('/seller')
        }
    }, [isSeller])

    return (
        <div className='min-h-screen flex items-center text-sm text-gray-600 bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden'>

            {/* Enhanced Background decorative elements */}
            <div className='absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse'></div>
            <div className='absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>
            <div className='absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-teal-300/20 to-emerald-300/20 rounded-full blur-2xl animate-bounce' style={{ animationDelay: '2s' }}></div>
            <div className='absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-emerald-100/30 to-teal-100/30 rounded-full blur-2xl animate-pulse' style={{ animationDelay: '0.5s' }}></div>

            <div className='flex flex-col gap-6 m-auto items-start p-10 py-12 min-w-80 sm:min-w-96 rounded-3xl shadow-2xl border border-gray-200/50 bg-white/90 backdrop-blur-lg relative z-10 hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2 hover:scale-[1.02] group'>

                {/* Glassmorphism overlay */}
                <div className='absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl pointer-events-none'></div>

                {/* Enhanced heading with icon and gradients */}
                <div className='w-full text-center space-y-4 relative z-10'>
                    {/* Seller icon with glow effect */}
                    <div className='mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl relative group-hover:scale-110 transition-transform duration-500'>
                        <div className='absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity duration-500'></div>
                        <svg className='w-8 h-8 text-white relative z-10' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'></path>
                        </svg>

                        {/* Icon sparkle effects */}
                        <div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-70'></div>
                        <div className='absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full animate-pulse opacity-80'></div>
                    </div>

                    {/* Enhanced title */}
                    <div className='space-y-2'>
                        <h1 className='text-3xl font-black leading-tight'>
                            <span className='bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-transparent bg-clip-text drop-shadow-sm animate-pulse'>
                                Seller
                            </span>
                            <span className='text-gray-800 ml-3'>Portal</span>
                        </h1>
                        <p className='text-gray-500 font-medium'>Welcome back! Please sign in to continue</p>
                    </div>

                    {/* Enhanced decorative line with animation */}
                    <div className='flex justify-center items-center gap-1 py-2'>
                        <div className='w-6 h-[3px] bg-gradient-to-r from-transparent to-emerald-500 rounded-full animate-pulse'></div>
                        <div className='w-16 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-full animate-pulse' style={{ animationDelay: '0.5s' }}></div>
                        <div className='w-6 h-[3px] bg-gradient-to-r from-teal-500 to-transparent rounded-full animate-pulse'></div>
                    </div>
                </div>

                {/* Enhanced Email Field */}
                <div className='w-full relative z-10'>
                    <label className='flex items-center gap-2 font-bold text-gray-700 mb-3 text-sm'>
                        <svg className='w-5 h-5 text-emerald-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'></path>
                        </svg>
                        Email Address
                    </label>
                    <div className='relative'>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className='border-2 border-gray-200 rounded-xl w-full p-4 pl-12 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-500 bg-gray-50/50 focus:bg-white hover:border-gray-300 placeholder-gray-400 font-medium backdrop-blur-sm group-hover:shadow-md'
                            type="email"
                            placeholder='your@email.com'
                            required
                        />
                        <div className='absolute left-4 top-1/2 transform -translate-y-1/2'>
                            <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Enhanced Password Field with show/hide toggle */}
                <div className='w-full relative z-10'>
                    <label className='flex items-center gap-2 font-bold text-gray-700 mb-3 text-sm'>
                        <svg className='w-5 h-5 text-emerald-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'></path>
                        </svg>
                        Password
                    </label>
                    <div className='relative'>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className='border-2 border-gray-200 rounded-xl w-full p-4 pl-12 pr-12 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-500 bg-gray-50/50 focus:bg-white hover:border-gray-300 placeholder-gray-400 font-medium backdrop-blur-sm group-hover:shadow-md'
                            type={showPassword ? "text" : "password"}
                            placeholder='Enter your password'
                            required
                        />
                        <div className='absolute left-4 top-1/2 transform -translate-y-1/2'>
                            <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'></path>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'></path>
                            </svg>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-300'
                        >
                            {showPassword ? (
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'></path>
                                </svg>
                            ) : (
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'></path>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'></path>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Remember me and Forgot password */}
                <div className='w-full flex justify-between items-center text-sm relative z-10'>
                    <label className='flex items-center gap-2 cursor-pointer group'>
                        <input type="checkbox" className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500' />
                        <span className='text-gray-600 group-hover:text-emerald-600 transition-colors duration-300'>Remember me</span>
                    </label>
                    <a href="#" className='text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-all duration-300'>
                        Forgot password?
                    </a>
                </div>

                {/* Enhanced Login Button with loading state */}
                <button
                    disabled={isLoading}
                    onClick={onSubmitHandler}
                    className='relative group bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 text-white font-bold w-full py-4 rounded-xl cursor-pointer transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed relative z-10'
                >
                    <span className='relative z-10 flex items-center justify-center gap-3'>
                        {isLoading ? (
                            <>
                                <svg className='w-5 h-5 animate-spin' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <svg className='w-6 h-6 group-hover:rotate-12 transition-transform duration-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'></path>
                                </svg>
                                Sign In to Dashboard
                            </>
                        )}
                    </span>

                </button>


            </div>

        </div>
    )
}

export default SellerLogin