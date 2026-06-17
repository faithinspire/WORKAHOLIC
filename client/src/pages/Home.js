import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          Welcome to FaithJobs
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Connect with teaching and lecturing opportunities across Nigeria's education sector
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Job Seekers */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">For Teachers & Lecturers</h2>
            <p className="text-gray-600 mb-6">
              Find your perfect teaching role at primary schools, secondary schools, polytechnics, and universities.
            </p>
            <Link
              to="/signup/jobseeker"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
            >
              Join as Job Seeker
            </Link>
          </div>

          {/* Recruiters */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🏫</div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">For Schools & Institutions</h2>
            <p className="text-gray-600 mb-6">
              Find qualified teachers and lecturers. Scan verified profiles with our subscription plans.
            </p>
            <Link
              to="/signup/recruiter"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-block"
            >
              Join as Recruiter
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-blue-900 mb-12">Why Choose FaithJobs?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl mb-4">⭐</div>
              <h4 className="font-bold text-lg mb-2">Star Rating System</h4>
              <p className="text-gray-600">Get rated based on your credentials, experience, and qualifications.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl mb-4">🔒</div>
              <h4 className="font-bold text-lg mb-2">Verified Profiles</h4>
              <p className="text-gray-600">All profiles are verified with credentials and ID uploads for trust.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl mb-4">🌍</div>
              <h4 className="font-bold text-lg mb-2">Nationwide Coverage</h4>
              <p className="text-gray-600">Access opportunities across all 36 states + FCT Abuja.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
