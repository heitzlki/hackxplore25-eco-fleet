'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from '@/lib/environment';
import { MapPopup } from '@/components/ui/map-popup';
import { GarbageContainer, useStore } from '@/lib/store'; // Import types and store hook
import { Pointer } from '@/components/magicui/pointer';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  CustomPoint,
  PopupInfo,
  RouteResponse,
  addRouteToMap,
  clearCustomPointMarkers,
  createContainerMarker,
  createCustomPointMarker,
  createWaypointMarker,
  downloadCSV,
  generateCSVFromPoints,
  getMaxFillLevel,
  getStatusFromLevel,
  removeRouteFromMap,
} from '@/lib/map-utils';

export default function MapView() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLayerId = useRef<string>('route-layer');
  const clickListenerRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(
    null
  );

  // Extract state and actions from the store
  const {
    garbageContainers,
    mapViewState: {
      isPopupOpen,
      popupData,
      customPoints,
      isPlacingMode,
      isLoadingRoute,
      center,
      zoom,
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

  // Function to open popup with data
  const openPopup = (data: PopupInfo) => {
    setPopupData(data);
    setPopupOpen(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setPopupOpen(false);
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

  // Effect to initialize the map
  useEffect(() => {
    (async () => {
      if (!mapContainerRef.current) return;

      mapboxgl.accessToken = (await environment()).mapBoxAccessToken;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/zhgr/cmarabpiy01pw01sl35e50m1p',
        projection: 'globe',
        attributionControl: false, // Disable the attribution control to remove the label
        // center: center,
        // zoom: zoom,
        // antialias: true,
        // pitch: 30,
        // bearing: 0,
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
      });

      map.on('move', () => {
        const mapCenter = map.getCenter();
        const mapZoom = map.getZoom();
        setMapCenter([mapCenter.lng, mapCenter.lat] as [number, number]);
        setMapZoom(mapZoom);
      });

      mapRef.current = map;

      // Add garbage container markers
      garbageContainers.forEach((container) => {
        // Create container marker with click handler
        createContainerMarker(container, map, openPopup);
      });
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []); // Empty dependency array since we're using refs

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

  return (
    <div className='h-screen w-screen relative overflow-hidden cursor-none z-0'>
      <div ref={mapContainerRef} className='h-full w-full relative z-0' />
    </div>
  );
}
