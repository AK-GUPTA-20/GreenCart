import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const InputField = ({ type, placeholder, name, icon, onChange, value }) => (
  <div className="relative group">
    {icon && (
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200 text-lg">
        {icon}
      </span>
    )}
    <input
      className={`w-full ${icon ? 'pl-10' : ''} px-3 py-3 rounded-xl border border-gray-300 bg-white/60 backdrop-blur-md outline-none text-gray-700 placeholder-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all duration-200 hover:bg-white/70`}
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      value={value}
      required
    />
  </div>
);

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await axios.post('/api/address/add', {
        address: address  // This structure matches what your backend expects
      });

      if (data.success) {
        toast.success('Address saved successfully!');

        // Reset form after successful submission
        setAddress({
          firstName: '',
          lastName: '',
          email: '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          phone: '',
        });

        // Navigate to cart after a short delay
        setTimeout(() => {
          navigate('/cart');
        }, 1500);

      } else {
        toast.error(data.message || 'Failed to add address. Please try again.');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error(error?.response?.data?.message || 'Failed to add address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pb-16 px-4 md:px-12 relative">
      {/* Header with enhanced styling */}
      <div className="text-center mb-12">
        <p className="text-3xl md:text-4xl text-gray-700 font-light">
          Add Shipping <span className="font-bold text-green-700 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Address</span>
        </p>
        <p className="text-gray-500 mt-2 text-sm md:text-base">Please fill in your delivery information</p>
      </div>

      <div className="flex flex-col-reverse lg:flex-row justify-between items-start gap-12 max-w-7xl mx-auto">
        {/* Enhanced Form Section */}
        <div className="flex-1 max-w-2xl w-full">
          <div className="bg-white/40 rounded-2xl shadow-2xl p-8 backdrop-blur-md border border-green-100 hover:shadow-3xl transition-all duration-300">
            <form onSubmit={onSubmitHandler} className="space-y-6 text-sm">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-600 text-xl">👤</span>
                  <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    icon="👤"
                    onChange={handleChange}
                    value={address.firstName}
                  />
                  <InputField
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    icon="👤"
                    onChange={handleChange}
                    value={address.lastName}
                  />
                </div>
                <InputField
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  icon="✉️"
                  onChange={handleChange}
                  value={address.email}
                />
                <InputField
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  icon="📞"
                  onChange={handleChange}
                  value={address.phone}
                />
              </div>

              {/* Address Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-600 text-xl">📍</span>
                  <h3 className="text-lg font-semibold text-gray-700">Shipping Address</h3>
                </div>
                <InputField
                  name="street"
                  type="text"
                  placeholder="Street Address"
                  icon="🏠"
                  onChange={handleChange}
                  value={address.street}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    name="city"
                    type="text"
                    placeholder="City"
                    icon="🏙️"
                    onChange={handleChange}
                    value={address.city}
                  />
                  <InputField
                    name="state"
                    type="text"
                    placeholder="State"
                    icon="📍"
                    onChange={handleChange}
                    value={address.state}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    name="zipCode"
                    type="text"
                    placeholder="Zip Code"
                    icon="📮"
                    onChange={handleChange}
                    value={address.zipCode}
                  />
                  <InputField
                    name="country"
                    type="text"
                    placeholder="Country"
                    icon="🌍"
                    onChange={handleChange}
                    value={address.country}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-8 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="text-xl">✓</span>
                    Save Address
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Enhanced Illustration Section */}
        <div className="flex-shrink-0 lg:w-96 w-full flex flex-col items-center">
          <div className="relative group">
            {/* Decorative elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-lg"></div>
            <div className="relative bg-white/30 backdrop-blur-md rounded-2xl p-8 border border-white/50 shadow-xl">
              {/* Placeholder for image - you can replace this with your actual image */}
              <div className="w-64 h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <span className="text-6xl">📍</span>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-700">Secure Delivery</h4>
                    <p className="text-sm text-gray-500">Your package will be delivered safely to your doorstep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional info cards */}
          <div className="mt-8 space-y-4 w-full max-w-sm">
            <div className="bg-white/40 backdrop-blur-md rounded-lg p-4 border border-white/50 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-sm text-gray-700">Fast & Secure Delivery</span>
              </div>
            </div>
            <div className="bg-white/40 backdrop-blur-md rounded-lg p-4 border border-white/50 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <span className="text-green-600 text-xl">📦</span>
                <span className="text-sm text-gray-700">Real-time Tracking</span>
              </div>
            </div>
            <div className="bg-white/40 backdrop-blur-md rounded-lg p-4 border border-white/50 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <span className="text-green-600 text-xl">🔄</span>
                <span className="text-sm text-gray-700">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;