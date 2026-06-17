import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { statesAndLGAs, subjects } from '../data/data';

export default function PostJob() {
  const [lgas, setLgas] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    educationLevel: '',
    subject: '',
    locationState: '',
    locationLga: '',
    employmentType: '',
    salary: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (formData.locationState) {
      setLgas(statesAndLGAs[formData.locationState] || []);
    }
  }, [formData.locationState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post(`http://localhost:5000/api/jobs/create/${userId}`, formData);
      setSuccess('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        educationLevel: '',
        subject: '',
        locationState: '',
        locationLga: '',
        employmentType: '',
        salary: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">📝 Post a New Job</h1>
          <p className="text-gray-600 mb-8 text-sm sm:text-base">Create an opportunity for talented teachers</p>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm sm:text-base">
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm sm:text-base">
              ✕ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Mathematics Teacher"
                className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Job description, requirements, and responsibilities..."
                className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">Education Level *</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select Level</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Polytechnic">Polytechnic</option>
                  <option value="University">University</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">State *</label>
                <select
                  name="locationState"
                  value={formData.locationState}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select State</option>
                  {Object.keys(statesAndLGAs).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">LGA</label>
                <select
                  name="locationLga"
                  value={formData.locationLga}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select LGA</option>
                  {lgas.map(lga => (
                    <option key={lga} value={lga}>{lga}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">Employment Type *</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">Salary (Optional)</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g., ₦50,000 - ₦100,000"
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-4 py-3 sm:py-4 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
            >
              {loading ? '⏳ Posting Job...' : '✓ Post Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
