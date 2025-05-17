'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from '@/lib/environment';
import { useStore } from '@/lib/store';
import { createContainerMarker } from '@/lib/map-utils';
import { PopupInfo } from '@/lib/map-utils';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const userLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const locationWatchIdRef = useRef<number | null>(null);
  const [center, setCenter] = useState<[number, number]>([8.403735115313623, 49.00791069535478]);
  const [zoom, setZoom] = useState(16);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [popupData, setPopupData] = useState<PopupInfo>({
    title: 'Location Information',
    description: 'No description available',
    properties: {},
    fillData: [],
  });

  // Get garbage containers from Zustand store
  const { garbageContainers } = useStore();

  // Function to open popup with data
  const openPopup = (data: PopupInfo) => {
    setPopupData(data);
    setIsPopupOpen(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Function to update the user location marker on the map
  const updateLocationMarker = (position: GeolocationPosition) => {
    if (!mapRef.current) return;
    
    const { longitude, latitude } = position.coords;
    const userCoordinates: [number, number] = [longitude, latitude];
    
    // Update state with user location
    setUserLocation(userCoordinates);
    setLocationError(null);
    
    // If this is the first update, create the marker
    if (!userLocationMarkerRef.current) {
      // Create a custom marker element for user location
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.style.width = '22px';
      el.style.height = '22px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#4285F4';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      
      // Add a pulsing effect
      const pulse = document.createElement('div');
      pulse.className = 'user-location-pulse';
      pulse.style.position = 'absolute';
      pulse.style.top = '-8px';
      pulse.style.left = '-8px';
      pulse.style.right = '-8px';
      pulse.style.bottom = '-8px';
      pulse.style.borderRadius = '50%';
      pulse.style.backgroundColor = 'rgba(66, 133, 244, 0.4)';
      pulse.style.animation = 'pulse 2s infinite';
      el.appendChild(pulse);
      
      // Ensure we only add the animation style once
      if (!document.getElementById('location-pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'location-pulse-animation';
        style.textContent = `
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Create and add the marker
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(userCoordinates)
        .addTo(mapRef.current);
      
      // Save marker reference
      userLocationMarkerRef.current = marker;
      
      // Only fly to user location on first position update
      if (isLocatingUser) {
        mapRef.current.flyTo({
          center: userCoordinates,
          zoom: 17,
          speed: 1.5,
          essential: true
        });
        
        setIsLocatingUser(false);
      }
    } else {
      // Just update the marker position for subsequent updates
      userLocationMarkerRef.current.setLngLat(userCoordinates);
    }
  };
  
  // Function to start tracking user location
  const startLocationTracking = () => {
    setIsLocatingUser(true);
    console.log("Starting location tracking");
    
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocatingUser(false);
      return;
    }
    
    // Stop any existing watch
    stopLocationTracking();
    
    // Start watching position
    try {
      const watchId = navigator.geolocation.watchPosition(
        // Success callback
        updateLocationMarker,
        // Error callback
        (error) => {
          console.error('Error tracking location:', error);
          setLocationError(`Error tracking location: ${error.message}`);
          setIsLocatingUser(false);
        },
        // Options
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000 // Accept positions up to 5 seconds old
        }
      );
      
      // Save the watch ID for cleanup
      locationWatchIdRef.current = watchId;
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      setLocationError('Failed to start location tracking');
      setIsLocatingUser(false);
    }
  };
  
  // Function to stop tracking user location
  const stopLocationTracking = () => {
    if (locationWatchIdRef.current !== null) {
      navigator.geolocation.clearWatch(locationWatchIdRef.current);
      locationWatchIdRef.current = null;
      console.log("Location tracking stopped");
    }
  };

  // Start location tracking when component mounts
  useEffect(() => {
    // Start tracking after a short delay to ensure everything is loaded
    const trackingTimer = setTimeout(() => {
      startLocationTracking();
    }, 2000);
    
    // Cleanup function to stop tracking when component unmounts
    return () => {
      clearTimeout(trackingTimer);
      stopLocationTracking();
    };
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize the map with the token from environment
    const initializeMap = async () => {
      try {
        // Set the Mapbox token from environment
        const env = await environment();
        mapboxgl.accessToken = env.mapBoxAccessToken || '';
        
        if (!mapContainerRef.current) return; // Safety check
        
        // Initialize the map
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/zhgr/cmarabpiy01pw01sl35e50m1p',
          projection: 'globe',
        });

        // Add a load event to trigger the flyTo animation once the map is ready
        map.on('load', () => {
          console.log('Map loaded');
          // Fly to the initial location with a smooth animation
          map.flyTo({
            center: center,
            zoom: zoom,
            pitch: 30,
            bearing: 0,
            speed: 0.8, // Animation speed (0.2 is very slow, 1.2 is very fast)
            curve: 1.0, // Animation curve (1 is linear)
            essential: true, // This animation is considered essential for the user experience
            duration: 6000, // Duration in milliseconds
          });
          
          // Add garbage container markers after map is loaded
          if (garbageContainers && garbageContainers.length > 0) {
            console.log(`Adding ${garbageContainers.length} garbage container markers`);
            garbageContainers.forEach(container => {
              // Create container marker with click handler
              createContainerMarker(container, map, openPopup);
            });
          }
        });

        // Update state when map moves
        map.on('move', () => {
          const mapCenter = map.getCenter();
          setCenter([mapCenter.lng, mapCenter.lat]);
          setZoom(map.getZoom());
        });

        // Save map instance to ref
        mapRef.current = map;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [garbageContainers]);

  return (
    <div className="h-screen w-full relative">
      <div ref={mapContainerRef} className="h-full w-full"></div>
      
      {/* Info Panel for container information */}
      {isPopupOpen && (
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg max-w-md z-10">
          <h3 className="text-lg font-semibold mb-2">{popupData.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-3">{popupData.description}</p>
          
          {/* Display properties */}
          <div className="space-y-1">
            {Object.entries(popupData.properties).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">{key}:</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
          
          <button
            onClick={closePopup}
            className="mt-3 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
