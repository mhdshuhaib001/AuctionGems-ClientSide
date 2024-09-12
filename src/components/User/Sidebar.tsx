import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userLogOut } from '../../store/slices/userSlice';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(userLogOut());
    localStorage.removeItem('accessToken');
    navigate('/home');
  };
  return (
    <div className="min-h-screen bg-white flex items-center ps-8 flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-800 shadow-lg rounded-md">
        <div className="p-4">
          <h2 className="text-xl text-white font-bold">My Profile</h2>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <Link
            to="/profile/dashboard"
            className="text-white hover:bg-gray-700 hover:text-gray-200 p-2 rounded transition duration-200"
          >
            Profile
          </Link>
          <Link
            to="/profile/seller"
            className="text-white hover:bg-gray-700 hover:text-gray-200 p-2 rounded transition duration-200"
          >
            Sell
          </Link>
          <Link
            to="/profile/password"
            className="text-white hover:bg-gray-700 hover:text-gray-200 p-2 rounded transition duration-200"
          >
            Password
          </Link>

          <a
            href="#my-auctions"
            className="text-white hover:bg-gray-700 hover:text-gray-200 p-2 rounded transition duration-200"
          >
            My Auctions
          </a>
          <a
            href="#payments"
            className="text-white hover:bg-gray-700 hover:text-gray-200 p-2 rounded transition duration-200"
          >
            Payments
          </a>
          <a
            href="#orders"
            className="text-white hover:bg-gray-700 hover:text-gray-200 p-2 rounded transition duration-200"
          >
            Orders
          </a>
          <a
            href="#password"
            className="text-white hover:bg-gray-700 hover:text-gray-200 p-2 rounded transition duration-200"
          >
            Password
          </a>
          <a
            href="#settings"
            onClick={handleLogout}
            className="text-white bg-gray-600 hover:bg-gray-500 hover:text-gray-100 p-2 rounded transition duration-200"
          >
            LogOut
          </a>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;