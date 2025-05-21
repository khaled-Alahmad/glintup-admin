"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Specify the default icon for Leaflet markers
const defaultIcon = L.icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// LocationMarker component to handle map clicks
function LocationMarker({
  position,
  onPositionChange,
}: {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPositionChange(lat, lng);
    },
  });

  return <Marker position={position} icon={defaultIcon} />;
}

interface MapComponentProps {
  latitude: string;
  longitude: string;
  onMapClick: (lat: number, lng: number) => void;
}

export default function MapComponent({
  latitude,
  longitude,
  onMapClick,
}: MapComponentProps) {
  // Initialize with default position for Kuwait if not provided
  const defaultLat = 29.3759;
  const defaultLng = 47.9774;
  
  // Convert string inputs to numbers
  const lat = latitude ? parseFloat(latitude) : defaultLat;
  const lng = longitude ? parseFloat(longitude) : defaultLng;
    // Track position as state
  const [position, setPosition] = useState<[number, number]>([lat, lng]);

  // Update position when props change
  useEffect(() => {
    if (latitude && longitude) {
      setPosition([parseFloat(latitude), parseFloat(longitude)]);
    }
  }, [latitude, longitude]);

  const handlePositionChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onMapClick(lat, lng);
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} onPositionChange={handlePositionChange} />
    </MapContainer>
  );
}
