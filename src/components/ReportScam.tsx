import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, CheckCircle, Send } from 'lucide-react';

export default function ReportScam() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    scamType: '',
    description: '',
    url: '',
    phoneNumber: '',
    email: '',
    severity: 'medium',
  });
  const [submitted, setSubmitted] = useState(false);

  const scamTypes = [
    'Phishing Email',
    'Fake Website',
    'Phone Scam',
    'SMS Scam',
    'Social Media Scam',
    'Investment Fraud',
    'Romance Scam',
    'Tech Support Scam',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Scam report submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        scamType: '',
        description: '',
        url: '',
        phoneNumber: '',
        email: '',
        severity: 'medium',
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Thank You for Your Report!
          </h2>
          <p className="text-gray-600 mb-6">
            Your scam report has been submitted successfully. Our team will review it and take appropriate action.
            You've earned 25 points for helping protect the community!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Reports like yours help us identify and stop scammers. Keep up the great work!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Report a Scam</h1>
        <p className="text-gray-600">
          Help protect your community by reporting suspicious activities and scams
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scam Type *
                </label>
                <select
                  name="scamType"
                  value={formData.scamType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a scam type</option>
                  {scamTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Please provide as much detail as possible about the scam..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="scammer@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity *
                  </label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit Report
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Reporting Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Be as specific as possible</li>
                  <li>• Include all relevant contact information</li>
                  <li>• Don't interact with the scammer</li>
                  <li>• Save any evidence you have</li>
                  <li>• Report to authorities if needed</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-3">Earn Points</h3>
            <p className="text-sm text-gray-700 mb-3">
              Each verified report earns you:
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Report submission</span>
                <span className="font-semibold text-blue-600">+25 pts</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Verified report</span>
                <span className="font-semibold text-blue-600">+50 pts</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-3">Your Reports</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Reports</span>
                <span className="font-semibold text-gray-800">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Verified</span>
                <span className="font-semibold text-green-600">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
