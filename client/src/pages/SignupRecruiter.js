import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { statesAndLGAs, universities, polytechnics } from '../data/data';
import { useNavigate } from 'react-router-dom';

export default function SignupRecruiter() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullname: '',
    phone: '',
    companyName: '',
    institutionType: '',
    universityId: '',
    polytechnicId: '',
    state: '',
    lga: '',
    subscriptionType: 'basic',
  });
  const [lgas, setLgas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.state) {
      setLgas(statesAndLGAs[formData.state] || []);
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup/recruiter', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userRole', 'recruiter');
      navigate('/dashboard/recruiter');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Recruiter Registration</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Institution Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Institution Type</label>
            <select
              name="institutionType"
              value={formData.institutionType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Type</option>
              <option value="Primary">Primary School</option>
              <option value="Secondary">Secondary School</option>
              <option value="University">University</option>
              <option value="Polytechnic">Polytechnic</option>
              <option value="Tuition Centre">Tuition Centre</option>
            </select>
          </div>

          {formData.institutionType === 'University' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">University</label>
              <select
                name="universityId"
                value={formData.universityId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select University</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
          )}

          {formData.institutionType === 'Polytechnic' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Polytechnic</label>
              <select
                name="polytechnicId"
                value={formData.polytechnicId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Polytechnic</option>
                {polytechnics.map(poly => (
                  <option key={poly} value={poly}>{poly}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select State</option>
              {Object.keys(statesAndLGAs).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">LGA</label>
            <select
              name="lga"
              value={formData.lga}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select LGA</option>
              {lgas.map(lga => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Subscription Plan</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="subscriptionType"
                  value="basic"
                  checked={formData.subscriptionType === 'basic'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Basic (₦5,000/month - 5 scans)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="subscriptionType"
                  value="premium"
                  checked={formData.subscriptionType === 'premium'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Premium (₦20,000/month - Unlimited)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
