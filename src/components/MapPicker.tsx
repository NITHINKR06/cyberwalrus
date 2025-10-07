import { useState, useEffect } from 'react';
import { MapPin, Search, Hash } from 'lucide-react';
import axios from 'axios';

interface MapPickerProps {
  onLocationSelect: (address: any) => void;
  onClose: () => void;
}

export default function MapPicker({ onLocationSelect, onClose }: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isPincodeSearching, setIsPincodeSearching] = useState(false);

  const popularKarnatakaCities = [
    'Bangalore, Karnataka',
    'Mysore, Karnataka', 
    'Hubli, Karnataka',
    'Mangalore, Karnataka',
    'Belgaum, Karnataka',
    'Gulbarga, Karnataka',
    'Davanagere, Karnataka',
    'Bellary, Karnataka',
    'Bijapur, Karnataka',
    'Shimoga, Karnataka'
  ];

  // Auto-detect and search pincodes
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length === 6 && /^\d{6}$/.test(trimmedQuery)) {
      // Debounce the pincode search
      const timer = setTimeout(() => {
        handlePincodeSearch(trimmedQuery);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // First try with Karnataka focus
      let response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Karnataka, India')}&limit=5&countrycodes=in`
      );
      
      // If no results, try broader search in India
      if (response.data.length === 0) {
        response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', India')}&limit=5&countrycodes=in`
        );
      }
      
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to manual suggestions for Karnataka
      const fallbackResults = getFallbackResults(searchQuery);
      setSearchResults(fallbackResults);
    } finally {
      setIsSearching(false);
    }
  };

  const getFallbackResults = (query: string) => {
    const queryLower = query.toLowerCase();
    return popularKarnatakaCities
      .filter(city => city.toLowerCase().includes(queryLower))
      .map(city => ({
        display_name: city,
        lat: getKarnatakaCityCoords(city).lat,
        lon: getKarnatakaCityCoords(city).lon,
        type: 'city',
        importance: 0.8
      }));
  };

  const getKarnatakaCityCoords = (city: string) => {
    const coords: { [key: string]: { lat: number; lon: number } } = {
      'Bangalore, Karnataka': { lat: 12.9716, lon: 77.5946 },
      'Mysore, Karnataka': { lat: 12.2958, lon: 76.6394 },
      'Hubli, Karnataka': { lat: 15.3647, lon: 75.1240 },
      'Mangalore, Karnataka': { lat: 12.9141, lon: 74.8560 },
      'Belgaum, Karnataka': { lat: 15.8497, lon: 74.4977 },
      'Gulbarga, Karnataka': { lat: 17.3297, lon: 76.8343 },
      'Davanagere, Karnataka': { lat: 14.4669, lon: 75.9264 },
      'Bellary, Karnataka': { lat: 15.1398, lon: 76.9214 },
      'Bijapur, Karnataka': { lat: 16.8240, lon: 75.7154 },
      'Shimoga, Karnataka': { lat: 13.9299, lon: 75.5681 }
    };
    return coords[city] || { lat: 12.9716, lon: 77.5946 }; // Default to Bangalore
  };

  const handlePincodeSearch = async (pincode: string) => {
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) return;
    
    setIsPincodeSearching(true);
    try {
      // Search by pincode using Postal PIN Code API
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      
      if (response.data && response.data.Status === 'Success' && response.data.PostOffice && response.data.PostOffice.length > 0) {
        const postOffice = response.data.PostOffice[0]; // Use first post office data
        
        // Parse the address components from postal API
        const locationData = {
          houseNo: '',
          streetName: '',
          village: postOffice.Name || '',
          tehsil: postOffice.Division || '',
          district: postOffice.District || '',
          state: postOffice.State || 'Karnataka',
          pincode: pincode,
          country: postOffice.Country || 'India',
        };
        
        console.log('Pincode search result:', locationData);
        onLocationSelect(locationData);
        onClose();
      } else {
        // Fallback: use pincode as is
        onLocationSelect({
          village: `Area with pincode ${pincode}`,
          state: 'Karnataka',
          pincode: pincode,
          country: 'India',
        });
        onClose();
      }
    } catch (error) {
      console.error('Pincode search error:', error);
      // Fallback: use pincode as is
      onLocationSelect({
        village: `Area with pincode ${pincode}`,
        state: 'Karnataka',
        pincode: pincode,
        country: 'India',
      });
      onClose();
    } finally {
      setIsPincodeSearching(false);
    }
  };

  const handleLocationSelect = async (place: any) => {
    try {
      // Get detailed address information
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${place.lat}&lon=${place.lon}`
      );
      
          const address = response.data.address;
          onLocationSelect({
            houseNo: address.house_number || '',
            streetName: address.road || '',
        village: address.village || address.town || address.city || '',
        tehsil: address.county || address.suburb || '',
        district: address.state_district || address.city_district || '',
        state: address.state || 'Karnataka',
            pincode: address.postcode || '',
        country: address.country || 'India',
      });
      
      onClose();
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback to basic information from display name
      const parts = place.display_name.split(',');
      onLocationSelect({
        village: parts[0]?.trim() || '',
        district: parts[1]?.trim() || '',
        state: 'Karnataka',
        country: 'India',
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Select Location</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
          
          <div className="mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                {/^\d{6}$/.test(searchQuery.trim()) ? (
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                ) : (
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                )}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter pincode (574110) or search location (Bangalore, Karnataka)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>
            
            {/* Pincode Search Status */}
            {isPincodeSearching && (
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Auto-fetching location for pincode {searchQuery}...</span>
              </div>
            )}
            
            {/^\d{6}$/.test(searchQuery.trim()) && !isPincodeSearching && (
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <Hash className="w-4 h-4" />
                <span className="text-sm">Pincode detected! Auto-fetching location data...</span>
              </div>
            )}
            
            {/* Manual Entry Option */}
            {searchQuery.trim() && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    onLocationSelect({
                      village: searchQuery,
                      state: 'Karnataka',
                      country: 'India',
                    });
                    onClose();
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Use "{searchQuery}" as location
                </button>
              </div>
            )}
          </div>

          {searchResults.length === 0 && !searchQuery && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Options:</h3>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Karnataka Cities:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {popularKarnatakaCities.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(city)}
                      className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Try Pincode Search:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['574110', '560001', '570001', '580001', '590001', '591101'].map((pincode, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(pincode)}
                      className="p-2 text-sm bg-green-100 hover:bg-green-200 rounded-lg text-center transition-colors font-mono"
                    >
                      {pincode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 mb-3">Search Results:</h3>
              {searchResults.map((place, index) => (
                <div
                  key={index}
                  onClick={() => handleLocationSelect(place)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">{place.display_name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Type: {place.type} | Importance: {place.importance?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchQuery && !isSearching && (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No locations found. Try a different search term.</p>
              <button
                onClick={() => {
                  // Manual location entry
                  onLocationSelect({
                    village: searchQuery,
                    state: 'Karnataka',
                    country: 'India',
                  });
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Use "{searchQuery}" as location
              </button>
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Search Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Enter 6-digit pincode</strong> (e.g., 574110) for auto-fetch</li>
              <li>• Focus on Karnataka locations for best results</li>
              <li>• Include city and state for better results</li>
              <li>• Try different spellings if no results found</li>
              <li>• Examples: "574110", "Bangalore, Karnataka", "Mysore, Karnataka"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}