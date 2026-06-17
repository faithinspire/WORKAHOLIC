import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { statesAndLGAs, subjects } from '../data/data';

export default function RecruiterDashboard() {
  const [recruiter, setRecruiter] = useState(null);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [filters, setFilters] = useState({
    state: '',
    lga: '',
    educationLevel: '',
    subject: '',
    minStarRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchRecruiterProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filters.state) {
      setLgas(statesAndLGAs[filters.state] || []);
    }
  }, [filters.state]);

  const fetchRecruiterProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recruiters/profile/${userId}`);
      setRecruiter(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load recruiter profile');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const searchJobSeekers = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/recruiters/search-jobseekers/${userId}`,
        filters
      );
      setJobSeekers(response.data.jobSeekers);
      setRecruiter(prev => ({ ...prev, scans_remaining: response.data.scansRemaining }));
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    }
  };

  const upgradePremium = async () => {
    try {
      await axios.post(`http://localhost:5000/api/recruiters/upgrade-premium/${userId}`);
      await fetchRecruiterProfile();
      alert('Successfully upgraded to Premium!');
    } catch (err) {
      alert('Upgrade failed');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-10">Loading...</div>;
  if (!recruiter) return <div className="container mx-auto px-4 py-10">Recruiter not found</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="text-6xl mb-4">🏫</div>
              <h2 className="text-2xl font-bold">{recruiter.company_name}</h2>
              <p className="text-gray-600">{recruiter.institution_type}</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-100 rounded">
                <p className="text-sm text-gray-600">Subscription Plan</p>
                <p className="text-lg font-bold text-blue-600">{recruiter.subscription_type?.toUpperCase()}</p>
              </div>
              <div className="p-4 bg-green-100 rounded">
                <p className="text-sm text-gray-600">Scans Remaining</p>
                <p className="text-lg font-bold text-green-600">
                  {recruiter.subscription_type === 'premium' ? 'Unlimited' : recruiter.scans_remaining}
                </p>
              </div>
              {recruiter.subscription_type === 'basic' && (
                <button
                  onClick={upgradePremium}
                  className="w-full bg-gold-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Upgrade to Premium ₦20,000
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Search Filters */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Find Job Seekers</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <select
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All States</option>
                {Object.keys(statesAndLGAs).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <select
                name="lga"
                value={filters.lga}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All LGAs</option>
                {lgas.map(lga => (
                  <option key={lga} value={lga}>{lga}</option>
                ))}
              </select>

              <select
                name="educationLevel"
                value={filters.educationLevel}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Levels</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Polytechnic">Polytechnic</option>
                <option value="University">University</option>
              </select>

              <select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Subjects</option>
                {subjects.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>

              <select
                name="minStarRating"
                value={filters.minStarRating}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">Any Rating</option>
                <option value="1">1+ Star</option>
                <option value="2">2+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5 Stars</option>
              </select>

              <button
                onClick={searchJobSeekers}
                disabled={recruiter.scans_remaining <= 0 && recruiter.subscription_type !== 'premium'}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Search
              </button>
            </div>
          </div>

          {/* Job Seekers Results */}
          <div className="space-y-4">
            {jobSeekers.length > 0 ? (
              jobSeekers.map((seeker, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold">{seeker.fullname}</h4>
                      <p className="text-sm text-gray-600">{seeker.education_level} | {seeker.subject}</p>
                      <p className="text-sm text-gray-600">{seeker.years_experience} years experience</p>
                      <p className="mt-2">{'⭐'.repeat(seeker.star_rating)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm"><strong>Phone:</strong> {seeker.phone}</p>
                      <p className="text-sm"><strong>State:</strong> {seeker.state}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-600">
                No job seekers found. Click "Search" to find candidates.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
