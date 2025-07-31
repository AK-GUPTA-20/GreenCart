import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const Loading = () => {
    const { navigate } = useAppContext();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const nextUrl = query.get('next');

    useEffect(() => {
        if (nextUrl) {
            const timer = setTimeout(() => {
                navigate(`/${nextUrl}`);
            }, 5000);
            return () => clearTimeout(timer); // Cleanup
        }
    }, [nextUrl]);

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-white text-center px-4">
            <div
                className="animate-spin rounded-full h-24 w-24 border-[6px] border-gray-200 border-t-green-500 shadow-md"
                role="status"
                aria-label="Loading spinner"
            ></div>

            <p className="mt-6 text-lg md:text-xl text-gray-700 font-medium animate-pulse">
                Redirecting, please wait...
            </p>

            {nextUrl && (
                <p className="mt-2 text-sm text-gray-500">
                    Destination: <span className="font-semibold text-green-600">/{nextUrl}</span>
                </p>
            )}
        </div>
    );
};

export default Loading;
