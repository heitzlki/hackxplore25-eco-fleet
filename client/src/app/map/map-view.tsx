'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from '@/lib/environment';
import { useStore } from '@/lib/store';
import {
  createContainerMarker,
  PopupInfo,
  CustomPoint,
  RouteResponse,
  addRouteToMap,
  removeRouteFromMap,
  createWaypointMarker,
  createCustomPointMarker,
  generateCSVFromPoints,
  downloadCSV,
  clearCustomPointMarkers,
} from '@/lib/map-utils';
import { cn } from '@/lib/utils';
import { Pointer } from '@/components/magicui/pointer';

interface MapViewProps {
  mode?: 'dashboard' | 'map';
  showControls?: boolean;
  enableLocationTracking?: boolean;
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
  children?: React.ReactNode;
  onMarkerClick?: (popupData: PopupInfo) => void;
  onMapInit?: (map: mapboxgl.Map) => void;
}

export default function MapView({
  mode = 'map',
  showControls = true,
  enableLocationTracking = mode === 'dashboard',
  initialCenter,
  initialZoom,
  className = 'h-screen w-screen relative overflow-hidden cursor-none z-0',
  children,
  onMarkerClick,
  onMapInit,
}: MapViewProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLayerId = useRef<string>('route-layer');
  const clickListenerRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(
    null
  );
  const userLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const locationWatchIdRef = useRef<number | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dashboard-specific state
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Extract state and actions from the store
  const {
    garbageContainers,
    mapViewState: {
      isPopupOpen,
      popupData,
      customPoints,
      isPlacingMode,
      isLoadingRoute, 
      center: storeCenter,
      zoom: storeZoom,
    },
    setPopupOpen,
    setPopupData,
    addCustomPoint: storeAddCustomPoint,
    removeCustomPoint: storeRemoveCustomPoint,
    clearCustomPoints: storeClearCustomPoints,
    setPlacingMode,
    togglePlacingMode: storeTogglePlacingMode,
    setLoadingRoute,
    setMapCenter,
    setMapZoom,
  } = useStore();
  
  // Reference to store container markers
  const containerMarkersRef = useRef<mapboxgl.Marker[]>([]);

  // Use initial values from props or fall back to store values
  const center = initialCenter || storeCenter;
  const zoom = initialZoom || storeZoom;

  // Function to open popup with data
  const openPopup = (data: PopupInfo) => {
    // Clear any existing timeout
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }

    // Store the popup data in the global state
    setPopupData(data);
    setPopupOpen(true);

    // Call the onMarkerClick callback if provided
    if (onMarkerClick) {
      onMarkerClick(data);
    }
  };

  // Function to toggle calendar visibility (dashboard mode)
  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  // Function to close the popup
  const closePopup = () => {
    if (mode === 'dashboard') {
      // First hide the popup with animation
      setIsPopupVisible(false);
      setShowCalendar(false);

      // Then remove it from the DOM after animation completes
      popupTimeoutRef.current = setTimeout(() => {
        setPopupOpen(false);
      }, 300); // Match this to the CSS transition duration
    } else {
      // Map mode - simple close
      setPopupOpen(false);
    }
  };

  // Function to request route between garbage containers
  const requestRoute = async () => {
    if (!mapRef.current || garbageContainers.length < 2) return;

    setLoadingRoute(true);

    try {
      // Format waypoints as required by the API
      const waypoints = garbageContainers.map(
        (container) => `${container.lng},${container.lat}`
      );

      const response = await fetch(
        `/api/mapbox/route?waypoints=${waypoints.join(';')}`
      );

      // Highlight the used waypoints with an order index
      waypoints.forEach((waypoint, index) => {
        const [lng, lat] = waypoint.split(',').map(Number);
        const container = garbageContainers.find(
          (c) => c.lng === lng && c.lat === lat
        );

        // Create a waypoint marker
        createWaypointMarker(
          lng,
          lat,
          index,
          container,
          mapRef.current!,
          openPopup
        );
      });

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const data: RouteResponse = await response.json();

      // Add the route to the map
      addRouteToMap(mapRef.current, data, routeLayerId.current);

      // Open a popup with route information
      openPopup({
        title: 'Optimized Route',
        description: 'Route between garbage containers',
        properties: {
          Containers: garbageContainers.length,
          Status: 'Route calculated',
        },
        fillData: [],
      });
    } catch (error) {
      console.error('Error fetching route:', error);

      // Show error in popup
      openPopup({
        title: 'Route Error',
        description: 'Failed to calculate route',
        properties: {
          Error: 'Could not fetch route data',
        },
        fillData: [],
      });
    } finally {
      setLoadingRoute(false);
    }
  };

  // Clear the current route
  const clearRoute = () => {
    if (!mapRef.current) return;

    // Remove route from map
    removeRouteFromMap(mapRef.current, routeLayerId.current);

    // Close popup
    closePopup();
  };

  // Function to add a custom point at clicked location
  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (!mapRef.current) return;

    const { lng, lat } = e.lngLat;
    const newPoint: CustomPoint = { lng, lat };
    const pointIndex = customPoints.length;

    console.log(
      `Adding point at ${lng}, ${lat}. Total points: ${pointIndex + 1}`
    );

    // Add to global store
    storeAddCustomPoint(newPoint);

    // Create custom point marker with removal capability
    createCustomPointMarker(
      newPoint,
      pointIndex,
      mapRef.current,
      isPlacingMode,
      openPopup,
      // Add callback for removing point when clicked
      (point, marker) => removeCustomPoint(point, marker)
    );
  };

  // Function to remove a specific custom point
  const removeCustomPoint = (point: CustomPoint, marker: mapboxgl.Marker) => {
    console.log(`Removing point at ${point.lng}, ${point.lat}`);

    // Remove the marker from the map
    marker.remove();

    // Remove the point from global state
    storeRemoveCustomPoint(point);

    // Show a toast notification
    openPopup({
      title: 'Point Removed',
      description: `Removed point at ${point.lng.toFixed(
        6
      )}, ${point.lat.toFixed(6)}`,
      properties: {
        Status: 'Success',
        'Remaining Points': customPoints.length - 1,
      },
      fillData: [],
    });

    // Auto-close popup after 1.5 seconds
    setTimeout(() => {
      closePopup();
    }, 1500);
  };

  // Generate and download CSV file with custom points
  const downloadPointsAsCSV = () => {
    if (customPoints.length === 0) {
      // Show a notification if no points
      openPopup({
        title: 'No Points',
        description: 'There are no custom points to export',
        properties: {
          Status: 'Failed',
        },
        fillData: [],
      });
      return;
    }

    // Generate CSV content and download
    const csvContent = generateCSVFromPoints(customPoints);
    const filename = `custom-points-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    downloadCSV(csvContent, filename);

    // Show success notification
    openPopup({
      title: 'CSV Export Successful',
      description: `Exported ${customPoints.length} custom points to CSV`,
      properties: {
        Points: customPoints.length,
        Format: 'CSV',
        Status: 'Success',
      },
      fillData: [],
    });
  };

  // Clear all custom points
  const clearCustomPoints = () => {
    if (customPoints.length === 0) return;

    // Remove all custom markers
    const removedCount = clearCustomPointMarkers();
    console.log(`Removed ${removedCount} custom markers`);

    // Clear state in the store
    storeClearCustomPoints();

    // Close popup
    closePopup();
  };

  // Function to update the user location marker on the map (dashboard mode)
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

  // Function to start location tracking (dashboard mode)
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
        maximumAge: 5000, // Accept positions up to 5 seconds old
      }
    );
  };

  // Function to stop tracking user location (dashboard mode)
  const stopLocationTracking = () => {
    if (locationWatchIdRef.current) {
      navigator.geolocation.clearWatch(locationWatchIdRef.current);
      locationWatchIdRef.current = null;
      console.log('Location tracking stopped');
    }
  };

  // Effect to initialize the map
  useEffect(() => {
    (async () => {
      if (!mapContainerRef.current) return;

      // Get Mapbox token from environment
      const env = await environment();
      mapboxgl.accessToken = env.mapBoxAccessToken || '';

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/zhgr/cmarabpiy01pw01sl35e50m1p',
        projection: 'globe',
        attributionControl: false, // Disable the attribution control to remove the label
        // For dashboard mode, start with a wider view until we get user location
        // zoom: mode === 'dashboard' ? 2 : zoom,
      });

      // Add a load event handler
      map.on('load', () => {
        console.log('Map loaded');

        // For dashboard mode, start location tracking immediately
        if (mode === 'dashboard' && enableLocationTracking) {
          startLocationTracking();
        }
        // For map mode, fly to the initial location with a smooth animation
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

        // Create garbage container markers but manage visibility based on zoom level
        const zoomThreshold = 13; // Only show markers when zoomed in beyond this level
        const typeIndicatorZoomThreshold = 15.7; // Only show type indicators when zoomed in beyond this level
        
        // Clear any existing markers
        containerMarkersRef.current.forEach(marker => marker.remove());
        containerMarkersRef.current = [];
        
        // Create markers for all containers
        garbageContainers.forEach((container) => {
          // Create container marker with click handler
          const marker = createContainerMarker(container, map, openPopup);
          containerMarkersRef.current.push(marker);
          
          // Initially set visibility based on current zoom level
          if (map.getZoom() < zoomThreshold) {
            marker.getElement().style.display = 'none';
          }
        });
        
        // Add styles for fade transitions - we'll use direct opacity manipulation instead of classes
        // for more precise control
        
        // Initialize markers with proper opacity based on current zoom
        const updateMarkerOpacity = (zoom: number) => {
          // Create a buffer zone for smoother transitions
          const fadeStartZoom = zoomThreshold - 0.5;
          const fadeEndZoom = zoomThreshold + 0.5;
          
          // Create buffer zones for type indicators
          const typeIndicatorFadeStartZoom = typeIndicatorZoomThreshold - 0.5;
          const typeIndicatorFadeEndZoom = typeIndicatorZoomThreshold + 0.5;
          
          containerMarkersRef.current.forEach(marker => {
            const el = marker.getElement();
            
            // Find type indicator element if it exists
            const typeIndicator = el.querySelector('[data-type-indicator="true"]') as HTMLElement | null;
            
            // Ensure transition property is set
            el.style.transition = 'opacity 0.4s ease-in-out';
            
            // Handle marker visibility
            if (zoom < fadeStartZoom) {
              // Fully hidden - but fade out first
              el.style.opacity = '0';
              
              // After transition completes, hide the element completely
              setTimeout(() => {
                // Only hide if we're still below the threshold
                if (map.getZoom() < fadeStartZoom) {
                  el.style.display = 'none';
                }
              }, 400); // Match transition duration
            } 
            else if (zoom > fadeEndZoom) {
              // Fully visible
              el.style.display = '';
              el.style.opacity = '1';
            }
            else {
              // In transition zone - calculate opacity based on zoom level
              const opacity = (zoom - fadeStartZoom) / (fadeEndZoom - fadeStartZoom);
              el.style.display = '';
              el.style.opacity = opacity.toString();
            }
            
            // Handle type indicator visibility separately
            if (typeIndicator) {
              if (zoom < typeIndicatorFadeStartZoom) {
                // Type indicator fully hidden
                typeIndicator.style.opacity = '0';
                
                // After transition completes, hide the element completely
                setTimeout(() => {
                  if (map.getZoom() < typeIndicatorFadeStartZoom) {
                    typeIndicator.style.display = 'none';
                  }
                }, 400); // Match transition duration
              } 
              else if (zoom > typeIndicatorFadeEndZoom) {
                // Type indicator fully visible
                typeIndicator.style.display = '';
                typeIndicator.style.opacity = '1';
              }
              else {
                // Type indicator in transition zone
                const opacity = (zoom - typeIndicatorFadeStartZoom) / (typeIndicatorFadeEndZoom - typeIndicatorFadeStartZoom);
                typeIndicator.style.display = '';
                typeIndicator.style.opacity = opacity.toString();
              }
            }
          });
        };
        
        // Set initial opacity based on starting zoom level
        updateMarkerOpacity(map.getZoom());
        
        // Add zoom change handler to show/hide markers with smooth transitions
        map.on('zoom', () => {
          updateMarkerOpacity(map.getZoom());
        });
        
        // Also handle zoom end event to ensure markers are in the correct state
        map.on('zoomend', () => {
          updateMarkerOpacity(map.getZoom());
        });
      });

      map.on('move', () => {
        const mapCenter = map.getCenter();
        const mapZoom = map.getZoom();

        // Only update state if values have changed significantly to prevent infinite loops
        const currentCenter = [mapCenter.lng, mapCenter.lat] as [
          number,
          number
        ];
        const currentZoom = mapZoom;

        // Check if center has changed by more than a small threshold
        const centerChanged =
          Math.abs(currentCenter[0] - center[0]) > 0.0001 ||
          Math.abs(currentCenter[1] - center[1]) > 0.0001;

        // Check if zoom has changed by more than a small threshold
        const zoomChanged = Math.abs(currentZoom - zoom) > 0.01;

        // Only update state if there's a meaningful change
        if (centerChanged) {
          setMapCenter(currentCenter);
        }

        if (zoomChanged) {
          setMapZoom(currentZoom);
        }
      });

      mapRef.current = map;

      // Call the onMapInit callback if provided
      if (onMapInit) {
        onMapInit(map);
      }
    })();

    return () => {
      // Clean up location tracking if active
      if (mode === 'dashboard' && enableLocationTracking) {
        stopLocationTracking();
      }

      // Remove map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mode, enableLocationTracking, garbageContainers]);

  // Effect to handle placing mode changes
  useEffect(() => {
    if (!mapRef.current) return;

    console.log('Placing mode effect triggered:', isPlacingMode);

    // Update cursor style
    mapRef.current.getCanvas().style.cursor = isPlacingMode ? 'crosshair' : '';

    // Remove any existing click listener
    if (clickListenerRef.current) {
      mapRef.current.off('click', clickListenerRef.current);
      clickListenerRef.current = null;
    }

    // If placing mode is on, add a new click listener
    if (isPlacingMode) {
      mapRef.current.on('click', handleMapClick);
      clickListenerRef.current = handleMapClick;
      console.log('Added click handler for placing mode');
    }

    // Cleanup function
    return () => {
      if (mapRef.current && clickListenerRef.current) {
        mapRef.current.off('click', clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [isPlacingMode]); // Only re-run when isPlacingMode changes

  // Render map with children for UI elements
  return (
    <div className={className}>
      <div ref={mapContainerRef} className='h-full w-full relative z-0' />

      {/* Render children (popups, controls, etc.) */}
      {children}

      {/* Map cursor for map mode */}
      {/* {mode === 'map' && <Pointer />} */}
    </div>
  );
}
