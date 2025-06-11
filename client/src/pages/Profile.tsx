import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://148.113.9.240:5039/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 404) {
            // Remove token if profile not found or unauthorized
            localStorage.removeItem('token');
            toast.error('Session expired. Please log in again.');
            setTimeout(() => navigate('/login'), 1000);
          } else {
            throw new Error('Failed to fetch profile');
          }
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        toast.error('Failed to load profile');
        // Remove token on any error
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 1000);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center py-12 px-4">
        {loading ? (
          <div className="text-blue-600 text-xl font-semibold">Loading profile...</div>
        ) : user ? (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl font-bold text-blue-600 mb-4">
              {user.username ? user.username[0].toUpperCase() : '?'}
            </div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">{user.username}</h2>
            <p className="text-gray-500 mb-4">Member since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            <div className="w-full border-t border-blue-100 my-4"></div>
            <div className="w-full flex flex-col gap-2 mb-6">
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Full Name:</span>
                <span>{user.fullName || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Email:</span>
                <span>{user.email || 'N/A'}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition">Logout</button>
          </div>
        ) : (
          <div className="text-red-500 text-lg">Profile not found.</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
