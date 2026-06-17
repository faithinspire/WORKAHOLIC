import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function JobSeekerDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/jobseekers/profile/${userId}`);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div className="container mx-auto px-4 py-10">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-10 text-red-600">{error}</div>;
  if (!profile) return <div className="container mx-auto px-4 py-10">Profile not found</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="text-6xl mb-4">👨‍🎓</div>
              <h2 className="text-2xl font-bold">{profile.fullname}</h2>
              <p className="text-gray-600">{profile.education_level} Teacher</p>
            </div>
            <div className="text-center py-4 border-t border-b">
              <div className="text-2xl">{renderStars(profile.star_rating)}</div>
              <p className="text-sm text-gray-600">{profile.star_rating} of 5 stars</p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>State:</strong> {profile.state}</p>
              <p><strong>LGA:</strong> {profile.lga}</p>
              <p><strong>Experience:</strong> {profile.years_experience} years</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Completeness */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Profile Completeness</h3>
            <div className="bg-gray-200 rounded-full h-4">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">75% Complete</p>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Documents</h3>
            {profile.documents && profile.documents.length > 0 ? (
              <ul className="space-y-2">
                {profile.documents.map((doc, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <span>{doc.type}</span>
                    <span className="text-sm text-green-600">✓ Uploaded</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No documents uploaded yet</p>
            )}
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Work Experience</h3>
            {profile.workExperience && profile.workExperience.length > 0 ? (
              <ul className="space-y-4">
                {profile.workExperience.map((exp, idx) => (
                  <li key={idx} className="p-4 bg-gray-100 rounded">
                    <p className="font-bold">{exp.role}</p>
                    <p className="text-sm text-gray-600">{exp.institution}</p>
                    <p className="text-sm text-gray-600">{exp.start_date} to {exp.end_date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No work experience added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
