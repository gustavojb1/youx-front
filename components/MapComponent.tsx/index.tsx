"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngBounds, LatLngExpression, Map as LeafletMap } from "leaflet";
import L from "leaflet";
import { useEffect, forwardRef, useImperativeHandle, useRef } from "react";

interface MapComponentProps {
  locations: {
    id: string;
    address: string;
    latitude: number;
    longitude: number;
  }[];
  onSelectLocation: (locationId: string) => void;
  selectedLocationId: string;
}

const defaultIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapComponent = forwardRef<{ invalidateSize: () => void }, MapComponentProps>(
  ({ locations, onSelectLocation, selectedLocationId }, ref) => {
    const mapRef = useRef<LeafletMap | null>(null);
    const bounds = new LatLngBounds(
      locations.map(
        (location) => [location.latitude, location.longitude] as [number, number]
      )
    );

    
    const CenterMap = ({ center }: { center: LatLngExpression }) => {
      const map = useMap();

      useEffect(() => {
        if (center) {
          map.setView(center, 13, { animate: true });
        } else {
          map.fitBounds(bounds);
        }

        
        map.whenReady(() => {
          setTimeout(() => {
            map.invalidateSize();
          }, 200); 
        });
      }, [center, map, bounds]);

      return null;
    };

    
    const initialCenter = selectedLocationId
      ? locations.find((loc) => loc.id === selectedLocationId)
        ? [
            locations.find((loc) => loc.id === selectedLocationId)!.latitude,
            locations.find((loc) => loc.id === selectedLocationId)!.longitude,
          ]
        : bounds.getCenter()
      : bounds.getCenter();

    
    useImperativeHandle(ref, () => ({
      invalidateSize: () => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      },
    }));

    return (
      <MapContainer
        center={initialCenter as LatLngExpression}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        bounds={bounds}
        ref={(instance) => {
          mapRef.current = instance ? (instance as unknown as LeafletMap) : null;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
          tileSize={256}
          keepBuffer={2}
          updateWhenIdle={false}
          updateWhenZooming={true}
          updateInterval={200}
          crossOrigin={true}
        />
        {selectedLocationId && (
          <CenterMap
            center={[
              locations.find((loc) => loc.id === selectedLocationId)?.latitude || 0,
              locations.find((loc) => loc.id === selectedLocationId)?.longitude || 0,
            ]}
          />
        )}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            eventHandlers={{
              click: () => onSelectLocation(location.id),
            }}
            icon={selectedLocationId === location.id ? selectedIcon : defaultIcon}
          >
            <Popup>{location.address}</Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }
);

MapComponent.displayName = "MapComponent";

export default MapComponent;
