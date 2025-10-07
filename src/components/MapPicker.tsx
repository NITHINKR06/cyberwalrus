import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPickerProps {
  onLocationSelect: (address: any) => void;
  onClose: () => void;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (address: any) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());

      // Reverse geocode to get address from coordinates
      axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(response => {
          const address = response.data.address;
          onLocationSelect({
            houseNo: address.house_number || '',
            streetName: address.road || '',
            village: address.village || address.town || '',
            tehsil: address.county || '',
            district: address.state_district || '',
            state: address.state || '',
            pincode: address.postcode || '',
            country: address.country || '',
          });
        })
        .catch(error => console.error('Reverse geocoding error:', error));
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function MapPicker({ onLocationSelect, onClose }: MapPickerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 h-[80vh] p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Select Location on Map</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          <div className="flex-grow rounded-lg overflow-hidden flex items-center justify-center">
            <div className="text-gray-500">Loading map...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 h-[80vh] p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Select Location on Map</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div className="flex-grow rounded-lg overflow-hidden">
          <MapContainer 
            center={[12.9141, 74.8560]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            key="map-container"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker onLocationSelect={onLocationSelect} />
          </MapContainer>
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">Click on the map to select the incident location.</p>
      </div>
    </div>
  );
}