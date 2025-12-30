import React, { useState } from 'react';
import { MapPin, ExternalLink, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface InteractiveMapProps {
  lat: number;
  lng: number;
  address: string;
  isEditing?: boolean;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ lat, lng, address, isEditing = false }) => {
  const [zoom, setZoom] = useState(15);
  const [isDragging, setIsDragging] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 20));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 1));

  const openGoogleMaps = () => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
  };

  return (
    <div className="relative bg-gray-100 rounded-lg h-64 overflow-hidden border border-gray-200">
      {/* Mock Map Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-50"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(156, 163, 175, 0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(156, 163, 175, 0.1) 25%, transparent 25%)
          `,
          backgroundSize: '40px 40px, 40px 40px, 20px 20px, 20px 20px'
        }}
      />

      {/* Street Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-400 border-opacity-30" />
          ))}
        </div>
      </div>

      {/* Location Pin */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
        <div className="relative">
          <MapPin 
            size={32} 
            className="text-red-600 fill-current drop-shadow-lg animate-bounce"
            style={{ animationDuration: '2s' }}
          />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black opacity-20 rounded-full blur-sm" />
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          title="Zoom In"
        >
          <ZoomIn size={16} className="text-gray-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          title="Zoom Out"
        >
          <ZoomOut size={16} className="text-gray-600" />
        </button>
        {isEditing && (
          <button
            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            title="Drag to Move Pin"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
          >
            <Move size={16} className={`${isDragging ? 'text-blue-600' : 'text-gray-600'}`} />
          </button>
        )}
      </div>

      {/* Map Info */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">Current Location</p>
              <p className="text-xs text-gray-600 mb-2">{address}</p>
              <p className="text-xs text-gray-500">
                Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)} | Zoom: {zoom}x
              </p>
            </div>
            <button
              onClick={openGoogleMaps}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors ml-3"
            >
              <ExternalLink size={12} />
              Google Maps
            </button>
          </div>
        </div>
      </div>

      {/* Mock Loading State for Real Maps */}
      <div className="absolute top-4 left-4">
        <div className="bg-green-100 border border-green-300 rounded-lg p-2">
          <p className="text-xs text-green-800 font-medium">
            📍 Interactive Map View
          </p>
          <p className="text-xs text-green-700">
            McDonald's USC Location
          </p>
        </div>
      </div>

      {/* Editing Overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center">
          <div className="bg-white rounded-lg p-3 shadow-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Edit Location</p>
            <p className="text-xs text-gray-600">Drag the pin to adjust position</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;