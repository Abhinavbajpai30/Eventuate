import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Person, 
  Email, 
  Phone, 
  LocationOn, 
  Edit, 
  Save, 
  Cancel,
  Logout,
  Verified,
  Cancel as NotVerified
} from '@mui/icons-material';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: {
      city: user?.location?.city || '',
      state: user?.location?.state || ''
    },
    interests: user?.interests || [],
    notifications: {
      email: user?.notifications?.email || true,
      sms: user?.notifications?.sms || false,
      push: user?.notifications?.push || true
    }
  });

  const interests = ['Music', 'Food & Drink', 'Workshops', 'Networking', 'Sports', 'Arts', 'Technology', 'Fitness'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await updateProfile(formData);
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: {
        city: user?.location?.city || '',
        state: user?.location?.state || ''
      },
      interests: user?.interests || [],
      notifications: {
        email: user?.notifications?.email || true,
        sms: user?.notifications?.sms || false,
        push: user?.notifications?.push || true
      }
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your account settings</p>
            </div>
            <div className="flex gap-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    <Cancel className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                <Logout className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <p className="text-gray-900">{user.email}</p>
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="location.state"
                      value={formData.location.state}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="State"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {user.location?.city && user.location?.state 
                      ? `${user.location.city}, ${user.location.state}`
                      : 'Not provided'
                    }
                  </p>
                )}
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <p className="text-gray-900 capitalize">{user.accountType}</p>
              </div>

              {/* Verification Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Status
                </label>
                <div className="flex items-center gap-2">
                  {user.isVerified ? (
                    <Verified className="h-5 w-5 text-green-500" />
                  ) : (
                    <NotVerified className="h-5 w-5 text-gray-400" />
                  )}
                  <span className={user.isVerified ? 'text-green-600' : 'text-gray-500'}>
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900">{user.bio || 'No bio provided'}</p>
                )}
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {interests.map(interest => (
                      <label key={interest} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                          className="rounded"
                        />
                        <span className="text-sm">{interest}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.interests?.length > 0 ? (
                      user.interests.map(interest => (
                        <span key={interest} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No interests selected</p>
                    )}
                  </div>
                )}
              </div>

              {/* Notification Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Preferences
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {Object.entries(formData.notifications).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={`notifications.${key}`}
                          checked={value}
                          onChange={handleChange}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{key} notifications</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {Object.entries(user.notifications || {}).map(([key, value]) => (
                      <p key={key} className="text-sm text-gray-600">
                        {key.charAt(0).toUpperCase() + key.slice(1)} notifications: {value ? 'Enabled' : 'Disabled'}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Account Stats */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Statistics
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{user.eventsCreated?.length || 0}</p>
                    <p className="text-sm text-gray-600">Events Created</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{user.eventsBooked?.length || 0}</p>
                    <p className="text-sm text-gray-600">Events Booked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 