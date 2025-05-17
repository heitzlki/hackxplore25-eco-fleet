'use client'
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from "@/lib/environment";
import { MapPopup } from "@/components/ui/map-popup";
import { GarbageContainer, useStore } from "@/lib/store"; // Import types and store hook
import { Pointer } from "@/components/magicui/pointer";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
  removeRouteFromMap
} from "@/lib/map-utils";

export default function Page() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const routeLayerId = useRef<string>("route-layer");
  const clickListenerRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(null);
  const [center, setCenter] = useState<any>([8.403735115313623, 49.00791069535478])
  const [zoom, setZoom] = useState(17.5)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [customPoints, setCustomPoints] = useState<CustomPoint[]>([]);
  const [isPlacingMode, setIsPlacingMode] = useState(false);

  // Single popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupInfo>({
    title: "Location Information",
    description: "No description available",
    properties: {},
    fillData: []
  });

  // Function to open popup with data
  const openPopup = (data: PopupInfo) => {
    setPopupData(data);
    setIsPopupOpen(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const { garbageContainers } = useStore();

  // Function to request route between garbage containers
  const requestRoute = async () => {
    if (!mapRef.current || garbageContainers.length < 2) return;

    setIsLoadingRoute(true);

    try {
      // Format waypoints as required by the API
      const waypoints = garbageContainers.map(container =>
        `${container.lng},${container.lat}`
      );

      const response = await fetch(`/api/mapbox/route?waypoints=${waypoints.join(';')}`);

      // Highlight the used waypoints with an order index
      waypoints.forEach((waypoint, index) => {
        const [lng, lat] = waypoint.split(',').map(Number);
        const container = garbageContainers.find(c => c.lng === lng && c.lat === lat);

        // Create a waypoint marker
        createWaypointMarker(lng, lat, index, container, mapRef.current!, openPopup);
      });

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const data: RouteResponse = await response.json();

      // Add the route to the map
      addRouteToMap(mapRef.current, data, routeLayerId.current);

      // Open a popup with route information
      openPopup({
        title: "Optimized Route",
        description: "Route between garbage containers",
        properties: {
          "Containers": garbageContainers.length,
          "Status": "Route calculated"
        },
        fillData: []
      });
    } catch (error) {
      console.error('Error fetching route:', error);

      // Show error in popup
      openPopup({
        title: "Route Error",
        description: "Failed to calculate route",
        properties: {
          "Error": "Could not fetch route data"
        },
        fillData: []
      });
    } finally {
      setIsLoadingRoute(false);
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

  // Toggle the placing mode
  const togglePlacingMode = () => {
    setIsPlacingMode(prev => !prev);
  };

  // Function to add a custom point at clicked location
  const addCustomPoint = (e: mapboxgl.MapMouseEvent) => {
    if (!mapRef.current) return;

    const { lng, lat } = e.lngLat;
    const newPoint = { lng, lat };
    const pointIndex = customPoints.length;

    console.log(`Adding point at ${lng}, ${lat}. Total points: ${pointIndex + 1}`);

    // Add to state
    setCustomPoints(prevPoints => [...prevPoints, newPoint]);

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

    // Remove the point from state
    setCustomPoints(prevPoints =>
      prevPoints.filter(p => !(p.lng === point.lng && p.lat === point.lat))
    );

    // Show a toast notification
    openPopup({
      title: "Point Removed",
      description: `Removed point at ${point.lng.toFixed(6)}, ${point.lat.toFixed(6)}`,
      properties: {
        "Status": "Success",
        "Remaining Points": customPoints.length - 1
      },
      fillData: []
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
        title: "No Points",
        description: "There are no custom points to export",
        properties: {
          "Status": "Failed"
        },
        fillData: []
      });
      return;
    }

    // Generate CSV content and download
    const csvContent = generateCSVFromPoints(customPoints);
    const filename = `custom-points-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);

    // Show success notification
    openPopup({
      title: "CSV Export Successful",
      description: `Exported ${customPoints.length} custom points to CSV`,
      properties: {
        "Points": customPoints.length,
        "Format": "CSV",
        "Status": "Success"
      },
      fillData: []
    });
  };

  // Clear all custom points
  const clearCustomPoints = () => {
    if (customPoints.length === 0) return;

    // Remove all custom markers
    const removedCount = clearCustomPointMarkers();
    console.log(`Removed ${removedCount} custom markers`);

    // Clear state
    setCustomPoints([]);

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
        projection: "globe",
        center: center,
        zoom: zoom,
        antialias: true,
        pitch: 30,
        bearing: 0
      });

      map.on('move', () => {
        const mapCenter = map.getCenter();
        const mapZoom = map.getZoom();
        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
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
  }, []);

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
      const clickHandler = (e: mapboxgl.MapMouseEvent) => {
        addCustomPoint(e);
      };
      
      mapRef.current.on('click', clickHandler);
      clickListenerRef.current = clickHandler;
      
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
    <div className="h-screen w-screen relative overflow-hidden cursor-none">
      <div ref={mapContainerRef} className="h-full w-full relative z-0"></div>
      <Pointer className="fill-blue-500" />
      
      {/* Control buttons for map features */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Custom Points Section */}
        <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg mb-2">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Custom Points</h3>
          
          <Button
            onClick={togglePlacingMode}
            className={`w-full mb-2 ${isPlacingMode ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white font-medium`}
          >
            {isPlacingMode ? 'Stop Placing Points' : 'Start Placing Points'}
          </Button>
          
          <Button
            onClick={downloadPointsAsCSV}
            disabled={customPoints.length === 0}
            className="w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Download Points as CSV
          </Button>
          
          <Button
            onClick={clearCustomPoints}
            disabled={customPoints.length === 0}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            Clear Custom Points
          </Button>
          
          <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">
            {customPoints.length} point{customPoints.length !== 1 ? 's' : ''} created
          </div>
        </div>
        
        {/* Route Planning Section */}
        <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Route Planning</h3>
          
          <Button
            onClick={requestRoute}
            disabled={isLoadingRoute}
            className="w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isLoadingRoute ? 'Calculating Route...' : 'Calculate Optimal Route'}
          </Button>

          <Button
            onClick={clearRoute}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white"
          >
            Clear Route
          </Button>
        </div>
        
        {/* Legacy Info Buttons - Collapsed */}
        <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg mt-2">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Info Panels</h3>
          
          <Button
            onClick={() => {
              openPopup({
                title: "Container Information",
                description: "Details about this waste container",
                properties: {
                  "Type": "Garbage Container",
                  "Capacity": "75%",
                  "Last Emptied": "2 days ago",
                  "Status": "Active"
                },
                fillData: []
              });
            }}
            className="w-full mb-2 bg-primary text-white"
          >
            Show Container Info
          </Button>

          <Button
            onClick={() => {
              openPopup({
                title: "Environmental Data",
                description: "Environmental impact information",
                properties: {
                  "Air Quality": "Good",
                  "Noise Level": "Moderate",
                  "Waste Collection": "Regular",
                  "Recycling Rate": "65%"
                },
                fillData: []
              });
            }}
            className="w-full bg-secondary text-white"
          >
            Show Environment Data
          </Button>
        </div>

        {isPopupOpen && (
          <Button
            onClick={closePopup}
            variant="destructive"
            className="mt-2"
          >
            <X className="mr-1 h-4 w-4" />
            Close Panel
          </Button>
        )}
      </div>
      
      {/* Single popup with fixed position */}
      <MapPopup 
        isOpen={isPopupOpen}
        onClose={closePopup}
        title={popupData.title}
        description={popupData.description}
        properties={popupData.properties}
        fillData={popupData.fillData}
        position={{ x: 24, y: 80 }} // Fixed position on the left side
      />
    </div>
  );
}