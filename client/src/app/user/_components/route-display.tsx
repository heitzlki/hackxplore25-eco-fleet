'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useStore } from '@/lib/store';
import { 
  RouteResponse, 
  createWaypointMarker, 
  addRouteToMap, 
  getContainerMarkerFromRouteRaw,
  getContainerMarkerFromRoute
} from '@/lib/map-utils';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Plus, RefreshCw, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface RouteDisplayProps {
  mapRef: React.RefObject<mapboxgl.Map | null>;
  onRouteCreated?: (success: boolean) => void;
  onMarkerClick: (data: any) => void;
}

export default function RouteDisplay({ mapRef, onRouteCreated, onMarkerClick }: RouteDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [routeCreated, setRouteCreated] = useState(false);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const { isSelectingMarkers, setIsSelectingMarkers, setMarkerElements, markerElements } = useStore();
   
  const routeLayerId = useRef<string>('user-route-layer');
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const regularMarkersRef = useRef<HTMLElement[]>([]);



  const { garbageContainers } = useStore();

  // Function to collect all regular container markers
  const collectRegularMarkers = () => {
    if (!mapRef.current) return;

    // Store references to all regular container markers
    regularMarkersRef.current = [];
    const markers = document.querySelectorAll('.mapboxgl-marker');

    markers.forEach(marker => {
      // Skip waypoint markers which we'll add later
      regularMarkersRef.current.push(marker as HTMLElement);
    });
  };

  // Function to fade out regular markers
  const fadeOutRegularMarkers = () => {
    // Collect regular markers if we haven't yet
    if (regularMarkersRef.current.length === 0) {
      collectRegularMarkers();
    }

    // Fade out all regular markers with a nice transition
    regularMarkersRef.current.forEach(marker => {
      marker.style.visibility = 'hidden';
    });
  };

  // Function to fade in regular markers
  const fadeInRegularMarkers = () => {
    regularMarkersRef.current.forEach(marker => {
      marker.style.visibility = 'visible';
    });
  };

  // Function to clear the current route
  const clearRoute = () => {
    if (!mapRef.current) return;

    // Remove route layer
    if (mapRef.current.getLayer(routeLayerId.current)) {
      mapRef.current.removeLayer(routeLayerId.current);
      mapRef.current.removeSource(routeLayerId.current);
    }

    // Remove waypoint markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Fade regular markers back in
    fadeInRegularMarkers();

    setRouteCreated(false);
    setRouteDistance(null);
    setRouteDuration(null);

    if (onRouteCreated) {
      onRouteCreated(false);
    }
  };

  // Function to create a route between the first 5 containers
  const createRoute = async () => {
    if (!mapRef.current || garbageContainers.length < 2) return;

    setIsLoading(true);
    clearRoute(); // Clear any existing route

    // Collect and fade out regular markers
    collectRegularMarkers();

    try {
      // Take only the first 5 waste containers (or all if less than 5)
      
      // Format waypoints as required by the API
      const waypoints = [
        "8.35869419195883,49.01571816015043", // Start point
        ...getContainerMarkerFromRoute().map((c) => `${c.lng},${c.lat}`)
      ]

      if (waypoints.length < 2) {
        alert('Not enough waypoints to create a route');
        return;
      }

      setIsSelectingMarkers(false)
      document.body.classList.remove('SELECTING_MARKERS');
      const markers = getContainerMarkerFromRouteRaw();
      markers.forEach(marker => {
        document.body.classList.remove(marker);
      })

      markerElements.forEach(element => {
        element.style.border = '2px solid white';
      })

      const response = await fetch(
        `/api/mapbox/optimized_route?waypoints=${waypoints.join(';')}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const data: RouteResponse = await response.json();

      // Add waypoint markers
      waypoints.forEach((waypoint, index) => {
        const [lng, lat] = waypoint.split(',').map(Number);
        const container = garbageContainers.find(
          (c) => c.lng === lng && c.lat === lat
        );

        // Create a waypoint marker and store the reference
        if (mapRef.current) {
          const marker = createWaypointMarker(
            lng,
            lat,
            index,
            container,
            mapRef.current,
            onMarkerClick
          );
          
          markersRef.current.push(marker);
        }
      });

      // Add the route to the map
      if (mapRef.current) {
        addRouteToMap(mapRef.current, data, routeLayerId.current);
      }

      // Extract route information if available
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        if (route.distance) {
          setRouteDistance(route.distance);
        }
        if (route.duration) {
          setRouteDuration(route.duration);
        }
      }

      // Now that route and waypoints are created, fade out regular markers
      fadeOutRegularMarkers();

      setRouteCreated(true);
      if (onRouteCreated) {
        onRouteCreated(true);
      }
    } catch (error) {
      console.error('Error creating route:', error);
      if (onRouteCreated) {
        onRouteCreated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Format distance in km
  const formatDistance = (meters: number): string => {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)} km`;
  };

  // Format duration in minutes
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} h ${remainingMinutes} min`;
    }
  };

  // Ensure we restore marker opacity when component unmounts
  useEffect(() => {
    return () => {
      // Clean up by restoring opacity to all markers
      if (regularMarkersRef.current.length > 0) {
        fadeInRegularMarkers();
      }
    };
  }, []);

  // Get screen width to adjust UI for mobile
  const [isMobile, setIsMobile] = useState(false);

  // Effect to check for mobile devices and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Main route info card - shown when route is active (both mobile and desktop) */}
      {routeCreated && (
        <div className={`${isMobile ? 'fixed inset-x-0 bottom-0 z-100 px-4 pb-4 pt-2' : 'absolute bottom-8 right-8 z-10'}`}>
          <Card className={`${isMobile ? 'w-full max-w-md mx-auto rounded-xl shadow-xl z-100' : 'rounded-lg shadow-lg'} p-4 animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`${isMobile ? 'text-base' : 'text-sm'} font-semibold text-gray-700 dark:text-gray-300`}>
                Collection Route
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400`}
                onClick={clearRoute}
              >
                <X className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
              </Button>
            </div>
            
            <div className={`space-y-${isMobile ? '3' : '2'}`}>
              <div className="flex items-center justify-between">
                <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-muted-foreground`}>Containers:</span>
                <Badge variant="outline" className={`${isMobile ? 'text-sm p-1' : 'text-xs'}`}>
                  <MapPin className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'} mr-1`} />
                  {markersRef.current.length}
                </Badge>
              </div>
              
              {routeDistance !== null && (
                <div className="flex items-center justify-between">
                  <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-muted-foreground`}>Distance:</span>
                  <Badge className={`${isMobile ? 'text-sm p-1' : 'text-xs'} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100`}>
                    {formatDistance(routeDistance)}
                  </Badge>
                </div>
              )}
              
              {routeDuration !== null && (
                <div className="flex items-center justify-between">
                  <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-muted-foreground`}>Duration:</span>
                  <Badge className={`${isMobile ? 'text-sm p-1' : 'text-xs'} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100`}>
                    {formatDuration(routeDuration * 2)}
                  </Badge>
                </div>
              )}
              
              {/* <Button 
                variant="outline" 
                size={isMobile ? "default" : "sm"}
                className={`w-full mt-1 ${isMobile ? 'text-sm h-10' : 'text-xs h-8'}`}
                onClick={createRoute}
              >
                <RefreshCw className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'} mr-1`} />
                Refresh Route
              </Button> */}
            </div>
          </Card>
        </div>
      )}
      
      {/* Desktop button - only shown when route is not active */}
      {!routeCreated && !isMobile && (
        <div className="absolute bottom-8 right-8 z-100 flex items-center gap-2">
          {
            isSelectingMarkers ? <>
              <Button onClick={() => {
                setIsSelectingMarkers(false)
                document.body.classList.remove('SELECTING_MARKERS');
                const markers = getContainerMarkerFromRouteRaw();
                markers.forEach(marker => {
                  document.body.classList.remove(marker);
                })

                markerElements.forEach(element => {
                  element.style.border = '2px solid white';
                })
              }}><X className="h-full aspect-square" /></Button>
              <Button onClick={() => {
                createRoute()
              }}>
                <Plus /> Create Route
                </Button>
            </>
            :
            <Button
              onClick={() => {
                setIsSelectingMarkers(true)
                document.body.classList.add('SELECTING_MARKERS');
              }}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  Create new Route
                </>
              )}
            </Button>
          }
        </div>
      )}
      
      {/* Mobile button - placed on right side of bottom bar when route is not created */}
      {!routeCreated && isMobile && (
        <div className="fixed bottom-4 right-4 z-50 w-[45%]">
          {
            isSelectingMarkers ? <>
            <div className="ml-2 flex gap-2 h-12 items-center justify-stretch w-full">
              <Button 
                className='h-full  w-[30%] rounded-xl'
                onClick={() => {
                  setIsSelectingMarkers(false)
                  document.body.classList.remove('SELECTING_MARKERS');
                  const markers = getContainerMarkerFromRouteRaw();
                  markers.forEach(marker => {
                    document.body.classList.remove(marker);
                })

                markerElements.forEach(element => {
                  element.style.border = '2px solid white';
                })
              }}><X className="h-full aspect-square" /></Button>
              <Button 
                className='h-full w-[60%]  rounded-xl'
                onClick={() => {
                  createRoute()
                }}>
                <Plus /> Route
              </Button>
            </div>
          </>
            :
            <Button
              onClick={() => {
                setIsSelectingMarkers(true)
                document.body.classList.add('SELECTING_MARKERS');
              }}
              disabled={isLoading}
              className="w-full h-12 text-base rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg ml-2"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <MapPin className="h-5 w-5 mr-1" />
                  Route
                </>
              )}
            </Button>
          }
        </div>
      )}
    </>
  );
}