import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Portfolio() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('experience');
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchPortfolio();
  }, [userId]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/profiles/${userId || currentUserId}`);
      setPortfolio(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load portfolio');
      console.error('Portfolio fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.post(`http://localhost:5000/api/profiles/${userId || currentUserId}/follow`, {
        follower_id: currentUserId
      });
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleMessage = () => {
    navigate(`/messages/${userId || currentUserId}`);
  };

  const renderStars = (rating = 0) => {
    const filled = Math.floor(rating || 0);
    const empty = 5 - filled;
    return '⭐'.repeat(filled) + '☆'.repeat(empty);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-700">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <p className="text-red-600 text-center mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">Portfolio not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-6 items-start">
            {/* Profile Image */}
            <div className="md:col-span-1 flex justify-center">
              <div className="relative">
                <img
                  src={portfolio.profile_image_url || 'https://via.placeholder.com/200?text=Profile'}
                  alt={portfolio.fullname}
                  className="w-40 h-40 rounded-full object-cover border-4 border-blue-600 shadow-lg"
                />
                <div className="absolute bottom-4 right-4 bg-yellow-400 rounded-full p-2">
                  <span className="text-lg">{renderStars(portfolio.star_rating)}</span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="md:col-span-3">
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{portfolio.fullname}</h1>
                <p className="text-xl text-blue-600 font-semibold">
                  {portfolio.education_level} • {portfolio.subject || 'Teaching'}
                </p>
                <div className="flex items-center mt-2 text-gray-600">
                  <span className="mr-4">📍 {portfolio.state}, {portfolio.lga}</span>
                  <span className="text-sm">⭐ {portfolio.star_rating || 0} of 5</span>
                </div>
              </div>

              {/* Bio */}
              {portfolio.bio && (
                <p className="text-gray-700 mb-6 leading-relaxed">{portfolio.bio}</p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {currentUserId && currentUserId !== (userId || currentUserId) && (
                  <>
                    <button
                      onClick={handleMessage}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      💬 Send Message
                    </button>
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-lg transition ${
                        isFollowing
                          ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isFollowing ? '✓ Following' : '+ Follow'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar - Stats */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-bold text-blue-600">{portfolio.years_experience || 0} years</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Employment Type</span>
                  <span className="font-bold text-blue-600">{portfolio.employment_type || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Profile Rating</span>
                  <span className="font-bold text-yellow-500">{portfolio.star_rating || 0}/5 ⭐</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-bold text-blue-600">{portfolio.created_at ? new Date(portfolio.created_at).getFullYear() : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📧</span>
                  <div className="text-sm">
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{portfolio.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📱</span>
                  <div className="text-sm">
                    <p className="text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{portfolio.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Tabs */}
          <div className="md:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
              <div className="flex border-b">
                {['experience', 'education', 'skills', 'documents'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-4 text-center font-semibold transition ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="space-y-4">
                    {portfolio.workExperience && portfolio.workExperience.length > 0 ? (
                      portfolio.workExperience.map((exp, idx) => (
                        <div key={idx} className="border-l-4 border-blue-600 pl-4 py-2">
                          <h4 className="font-bold text-gray-900">{exp.role}</h4>
                          <p className="text-blue-600 font-semibold">{exp.institution}</p>
                          <p className="text-sm text-gray-600">
                            {exp.start_date} to {exp.end_date || 'Present'}
                          </p>
                          {exp.description && (
                            <p className="text-gray-700 mt-2">{exp.description}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-center py-8">No work experience added yet</p>
                    )}
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-600 pl-4 py-2">
                      <h4 className="font-bold text-gray-900">{portfolio.education_level}</h4>
                      <p className="text-gray-600">{portfolio.subject || 'Teaching'}</p>
                      {portfolio.qualification && (
                        <p className="text-sm text-gray-600 mt-2">{portfolio.qualification}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="space-y-4">
                    {portfolio.skills ? (
                      <div className="flex flex-wrap gap-2">
                        {portfolio.skills.split(',').map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-8">No skills added yet</p>
                    )}
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    {portfolio.documents && portfolio.documents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolio.documents.map((doc, idx) => (
                          <div
                            key={idx}
                            className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-600 transition"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">📄</span>
                              <div>
                                <h5 className="font-bold text-gray-900">{doc.type}</h5>
                                {doc.verified && (
                                  <span className="text-xs text-green-600 font-semibold">✓ Verified</span>
                                )}
                              </div>
                            </div>
                            {doc.file_url && (
                              <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                View Document →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-8">No documents uploaded yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
