import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, CheckCircle, Send, MapPin, Phone, Shield, Download, Map } from 'lucide-react';
import { submitScamReport, reportService } from '../services/backendApi';
import MapPicker from './MapPicker';

export default function ReportScam() {
  const { user } = useAuth(); // Keep for potential future use
  const [formData, setFormData] = useState({
    scamType: '',
    description: '',
    url: '',
    phoneNumber: '',
    email: '',
    severity: 'medium',
    // Location details
    village: '',
    tehsil: '',
    policeStation: '',
    pincode: '',
    houseNo: '',
    streetName: '',
    colony: '',
    district: '',
    state: '',
    country: 'India',
    // Personal details for complaint
    fullName: '',
    mobile: '',
    gender: '',
    dob: '',
    spouse: '',
    relationWithVictim: '',
    emailAddress: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showMap, setShowMap] = useState(false); // State to control map visibility
  const [submittedReport, setSubmittedReport] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scamTypes = [
    'Phishing Email', 'Fake Website', 'Phone Scam', 'SMS Scam', 'Social Media Scam',
    'Investment Fraud', 'Romance Scam', 'Tech Support Scam', 'UPI Related Frauds',
    'Online Financial Fraud', 'Other',
  ];

  const genders = ['Male', 'Female', 'Other'];
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh', 'Puducherry'
  ];

  const nearbyStations = [
    { name: 'Cyber Crime Police Station', phone: '1800-419-3737', type: 'cyber' },
    { name: 'Local Police Station', phone: '100', type: 'police' },
    { name: 'National Cyber Crime Helpline', phone: '1930', type: 'helpline' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        scamType: formData.scamType,
        description: formData.description,
        websiteUrl: formData.url || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        emailAddress: formData.email || undefined,
        severity: formData.severity,
        fullName: formData.fullName || undefined,
        mobile: formData.mobile || undefined,
        gender: formData.gender || undefined,
        dob: formData.dob || undefined,
        spouse: formData.spouse || undefined,
        relationWithVictim: formData.relationWithVictim || undefined,
        personalEmail: formData.emailAddress || undefined,
        houseNo: formData.houseNo || undefined,
        streetName: formData.streetName || undefined,
        colony: formData.colony || undefined,
        village: formData.village || undefined,
        tehsil: formData.tehsil || undefined,
        district: formData.district || undefined,
        state: formData.state || undefined,
        country: formData.country || undefined,
        policeStation: formData.policeStation || undefined,
        pincode: formData.pincode || undefined,
      };

      const response = await submitScamReport(payload);
      setSubmittedReport(response);

      setSubmitted(true);
      setFormData({
        scamType: '', description: '', url: '', phoneNumber: '', email: '', severity: 'medium',
        village: '', tehsil: '', policeStation: '', pincode: '', houseNo: '', streetName: '',
        colony: '', district: '', state: '', country: 'India', fullName: '', mobile: '',
        gender: '', dob: '', spouse: '', relationWithVictim: '', emailAddress: '',
      });
    } catch (err) {
      console.error('Report submission failed:', err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!submittedReport?.reportId) return;
    
    try {
      const blob = await reportService.downloadPDF(submittedReport.reportId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `complaint_${submittedReport.complaintNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationSelect = (address: any) => {
    setFormData(prevData => ({
      ...prevData,
      ...address,
    }));
    setShowMap(false); // Close the map after selection
  };

  const LocationPopup = () => {
    if (!showLocationPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Nearby Police Stations & Helplines</h2>
              <button
                onClick={() => setShowLocationPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {nearbyStations.map((station, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {station.type === 'cyber' ? (
                        <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      ) : station.type === 'helpline' ? (
                        <Phone className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800">{station.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {station.type === 'cyber' ? 'Cyber Crime Specialized' : 
                           station.type === 'helpline' ? '24/7 Helpline' : 'Local Police Station'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{station.phone}</p>
                      <button className="text-blue-600 text-sm hover:underline mt-1">
                        Call Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Call 100 for immediate police assistance</li>
                <li>• Contact 1930 for cyber crime complaints</li>
                <li>• Keep all evidence and documents ready</li>
                <li>• File FIR within 24 hours for better action</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
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
            You've earned {submittedReport?.pointsAwarded || 25} points for helping protect the community!
          </p>
          
          {submittedReport?.isOfficialComplaint && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">Official Complaint Generated</h3>
              <p className="text-sm text-green-700 mb-3">
                Complaint Number: <span className="font-mono font-bold">{submittedReport.complaintNumber}</span>
              </p>
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Download className="w-4 h-4" />
                Download Official Complaint PDF
              </button>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Reports like yours help us identify and stop scammers. Keep up the great work!
            </p>
          </div>
          
          <button
            onClick={() => {
              setSubmitted(false);
              setSubmittedReport(null);
            }}
            className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {showMap && <MapPicker onLocationSelect={handleLocationSelect} onClose={() => setShowMap(false)} />}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Report a Scam</h1>
        <p className="text-gray-600">
          Help protect your community by reporting suspicious activities and scams
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-8">
              {/* Scam Report Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Scam Report Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scam Type *
                    </label>
                    <select
                      name="scamType" value={formData.scamType} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a scam type</option>
                      {scamTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description" value={formData.description} onChange={handleChange} required rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Please provide as much detail as possible about the scam..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                      <input type="url" name="url" value={formData.url} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="scammer@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Severity *</label>
                      <select name="severity" value={formData.severity} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Complainant Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                      <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        {genders.map(gender => (<option key={gender} value={gender}>{gender}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Name</label>
                      <input type="text" name="spouse" value={formData.spouse} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Spouse name if applicable"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relation with Victim</label>
                      <input type="text" name="relationWithVictim" value={formData.relationWithVictim} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Self/Spouse/Parent/Guardian"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Details Section */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Complainant Address</h3>
                  <button type="button" onClick={() => setShowMap(true)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Map size={16} />
                    Select from Map
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">House No.</label>
                      <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="House/Flat number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Name *</label>
                      <input type="text" name="streetName" value={formData.streetName} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Street/Lane name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Colony/Area</label>
                      <input type="text" name="colony" value={formData.colony} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Colony/Area name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Village/Town *</label>
                      <input type="text" name="village" value={formData.village} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Village/Town name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tehsil *</label>
                      <input type="text" name="tehsil" value={formData.tehsil} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tehsil name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                      <input type="text" name="district" value={formData.district} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="District name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <select name="state" value={formData.state} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select State</option>
                        {states.map(state => (<option key={state} value={state}>{state}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Police Station *</label>
                      <input type="text" name="policeStation" value={formData.policeStation} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Police station name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="6-digit pincode" maxLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input type="text" name="country" value={formData.country} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => setShowLocationPopup(true)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Find Nearby Police Stations
                </button>
                
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Official Complaint
                    </>
                  )}
                </button>
              </div>
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
            <p className="text-sm text-gray-700 mb-3">Each verified report earns you:</p>
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
      
      <LocationPopup />
    </div>
  );
}