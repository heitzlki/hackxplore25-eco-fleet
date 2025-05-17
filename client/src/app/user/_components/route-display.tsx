'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useStore } from '@/lib/store';
import { 
  RouteResponse, 
  createWaypointMarker, 
  addRouteToMap 
} from '@/lib/map-utils';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, RefreshCw, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RouteDisplayProps {
  mapRef: React.RefObject<mapboxgl.Map>;
  onRouteCreated?: (success: boolean) => void;
  onMarkerClick: (data: any) => void;
}

export default function RouteDisplay({ mapRef, onRouteCreated, onMarkerClick }: RouteDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [routeCreated, setRouteCreated] = useState(false);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const routeLayerId = useRef<string>('user-route-layer');
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const { garbageContainers } = useStore();

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

    try {
      // Take only the first 5 waste containers (or all if less than 5)
      const routeContainers = [
        garbageContainers[0],
        garbageContainers[1],
        garbageContainers[2],
      ]
      
      // Format waypoints as required by the API
      const waypoints = routeContainers.map(
        (container) => `${container.lng},${container.lat}`
      );

      const response = await fetch(
        `/api/mapbox/route?waypoints=${waypoints.join(';')}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const data: RouteResponse = await response.json();

      // Add waypoint markers
      waypoints.forEach((waypoint, index) => {
        const [lng, lat] = waypoint.split(',').map(Number);
        const container = routeContainers.find(
          (c) => c.lng === lng && c.lat === lat
        );

        // Create a waypoint marker and store the reference
        const marker = createWaypointMarker(
          lng,
          lat,
          index,
          container,
          mapRef.current!,
          onMarkerClick
        );
        
        markersRef.current.push(marker);
      });

      // Add the route to the map
      addRouteToMap(mapRef.current, data, routeLayerId.current);

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

  return (
    <div className="absolute bottom-8 right-8 z-10">
      <div className="flex flex-col gap-2">
        {routeCreated && (
          <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Collection Route
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={clearRoute}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Containers:</span>
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {markersRef.current.length}
                </Badge>
              </div>
              
              {routeDistance !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Distance:</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs">
                    {formatDistance(routeDistance)}
                  </Badge>
                </div>
              )}
              
              {routeDuration !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Duration:</span>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 text-xs">
                    {formatDuration(routeDuration)}
                  </Badge>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-1 text-xs h-8"
                onClick={createRoute}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh Route
              </Button>
            </div>
          </div>
        )}
        
        {!routeCreated && (
          <Button
            onClick={createRoute}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Calculating Route...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Show Waste Collection Route
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}