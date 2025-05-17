'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from '@/lib/environment';
import { useStore } from '@/lib/store';
import { createContainerMarker } from '@/lib/map-utils';
import { PopupInfo } from '@/lib/map-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export default function Dashboard() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const userLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const locationWatchIdRef = useRef<number | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [center, setCenter] = useState<[number, number]>([8.403735115313623, 49.00791069535478]);
  const [zoom, setZoom] = useState(16);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
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
    // Clear any existing timeout
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }
    
    setPopupData(data);
    setIsPopupOpen(true);
    
    // Add a small delay before showing the popup to ensure the DOM is updated
    setTimeout(() => {
      setIsPopupVisible(true);
    }, 50);
  };

  // Function to close the popup with animation
  const closePopup = () => {
    // First hide the popup with animation
    setIsPopupVisible(false);
    
    // Then remove it from the DOM after animation completes
    popupTimeoutRef.current = setTimeout(() => {
      setIsPopupOpen(false);
    }, 300); // Match this to the CSS transition duration
  };

  // Function to update the user location marker on the map
  const updateUserLocationMarker = (position: GeolocationPosition) => {
    if (!mapRef.current) return;
    
    const { longitude, latitude } = position.coords;
    const lngLat: [number, number] = [longitude, latitude];
    
    // Check if this is the first location update
    const isFirstUpdate = !userLocation;
    
    // Update state
    setUserLocation(lngLat);
    setIsLocatingUser(false);
    setLocationError(null);
    
    // Create or update the marker
    if (!userLocationMarkerRef.current) {
      // Create a pulsing dot element for the user location
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#4285F4';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 0 2px rgba(66, 133, 244, 0.3)';
      el.style.animation = 'pulse 1.5s infinite';
      
      // Add the pulsing animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.5); }
          70% { box-shadow: 0 0 0 15px rgba(66, 133, 244, 0); }
          100% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
        }
      `;
      document.head.appendChild(style);
      
      // Create and add the marker
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(lngLat)
        .addTo(mapRef.current);
      
      // Store the marker reference
      userLocationMarkerRef.current = marker;
    } else {
      // Update existing marker position
      userLocationMarkerRef.current.setLngLat(lngLat);
    }
    
    // If this is the first location update, fly to the user's location
    if (isFirstUpdate && mapRef.current) {
      mapRef.current.flyTo({
        center: lngLat,
        zoom: 16,
        pitch: 30,
        bearing: 0,
        speed: 1.2, // Faster animation for initial location
        curve: 1.0,
        essential: true,
        duration: 3000,
      });
    }
  };

  // Function to start location tracking
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocatingUser(true);
    
    // Start watching position
    locationWatchIdRef.current = navigator.geolocation.watchPosition(
      // Success callback
      (position) => {
        updateUserLocationMarker(position);
      },
      // Error callback
      (error) => {
        console.error('Error getting location:', error);
        setLocationError(`Error getting location: ${error.message}`);
        setIsLocatingUser(false);
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000 // Accept positions up to 5 seconds old
      }
    );
  };
  
  // Function to stop tracking user location
  const stopLocationTracking = () => {
    if (locationWatchIdRef.current) {
      navigator.geolocation.clearWatch(locationWatchIdRef.current);
      locationWatchIdRef.current = null;
      console.log("Location tracking stopped");
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize the map with the token from environment
    const initializeMap = async () => {
      try {
        // Set the Mapbox token from environment
        const env = await environment();
        mapboxgl.accessToken = env.mapBoxAccessToken || '';
        
        if (!mapContainerRef.current) return; // Safety check
        
        // Initialize the map without setting center/zoom initially
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/zhgr/cmarabpiy01pw01sl35e50m1p',
          projection: 'globe',
          // Start with a wider view until we get user location
          zoom: 2,
        });

        // Add a load event handler
        map.on('load', () => {
          console.log('Map loaded');
          
          // Start location tracking immediately when map loads
          startLocationTracking();
          
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
      stopLocationTracking();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [garbageContainers]);

  return (
    <div className="h-screen w-full relative">
      <div ref={mapContainerRef} className="h-full w-full"></div>
      
      {/* Info Panel for container information using shadcn UI with animations */}
      {isPopupOpen && (
        <div 
          className={`absolute top-4 right-4 z-50 w-80 transition-all duration-300 ease-in-out transform ${
            isPopupVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 -translate-y-4 scale-95'
          }`}
        >
          <Card className="border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
            <CardHeader className="pb-2 relative">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">{popupData.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{popupData.description}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10" onClick={closePopup}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative">
              <div className="grid gap-2">
                {Object.entries(popupData.properties)
                  .filter(([key]) => key !== 'Longitude' && key !== 'Latitude')
                  .map(([key, value], index) => (
                    <div 
                      key={key} 
                      className="flex justify-between items-center"
                      style={{ 
                        animation: `fadeIn 0.3s ease-out forwards ${index * 0.05 + 0.1}s`,
                        opacity: 0 
                      }}
                    >
                      <span className="text-sm text-muted-foreground">{key}</span>
                      <Badge variant="secondary" className="font-normal">{value}</Badge>
                    </div>
                  ))}
              </div>
              
              <style jsx global>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(8px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </CardContent>
            
            <CardFooter className="pt-0 flex justify-end relative">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={closePopup}
                className="transition-all hover:bg-primary hover:text-primary-foreground"
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
