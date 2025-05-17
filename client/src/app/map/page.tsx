'use client'
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from "@/lib/environment";
import { MapPopup } from "@/components/ui/map-popup";
import { FillData, GarbageContainer, WasteTypes, useStore } from "@/lib/store"; // Import types and store hook
import { Pointer } from "@/components/magicui/pointer";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Define a type for our popup data
interface PopupInfo {
  title: string;
  description: string;
  properties: Record<string, any>;
  fillData: FillData;
}

interface RouteResponse {
  routes: Array<{
    geometry: {
      coordinates: [number, number][];
    };
  }>;
}

// Custom point type
interface CustomPoint {
  lng: number;
  lat: number;
}

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
        // Find the container to get its waste types
        const container = garbageContainers.find(c => c.lng === lng && c.lat === lat);
        const maxFillLevel = container ? getMaxFillLevel(container.waste_types) : 0;

        // Create a marker element with an index label
        const el = document.createElement('div');
        el.style.backgroundColor = '#f00';
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.borderRadius = '50%';
        el.style.display = 'flex';
        el.style.justifyContent = 'center';
        el.style.alignItems = 'center';
        el.style.color = '#fff';
        el.style.fontSize = '12px';
        el.style.fontWeight = 'bold';
        el.textContent = (index + 1).toString();

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(mapRef.current!);

        marker.getElement().addEventListener('click', () => {
          // Calculate max fill level from waste types
          const maxFillLevel = container ? getMaxFillLevel(container.waste_types) : 0;

          // Create base properties
          const waypointProperties: Record<string, any> = {
            "Longitude": lng,
            "Latitude": lat,
            "Order": index + 1,
            "Max Fill Level": maxFillLevel ? `${maxFillLevel}%` : 'Unknown',
            "Status": getStatusFromLevel(maxFillLevel)
          };

          // Add waste type information if available
          let description = `Waypoint ${index + 1}${maxFillLevel ? ` - Max Fill Level: ${maxFillLevel}%` : ''}`;

          if (container && container.waste_types) {
            const { glass, aluminum, general } = container.waste_types;

            // Glass
            if (glass >= 0) {
              waypointProperties["Glass"] = `${glass}%`;
              waypointProperties["Glass Status"] = getStatusFromLevel(glass);
            }

            // Aluminum
            if (aluminum >= 0) {
              waypointProperties["Aluminum"] = `${aluminum}%`;
              waypointProperties["Aluminum Status"] = getStatusFromLevel(aluminum);
            }

            // General waste
            if (general >= 0) {
              waypointProperties["General Waste"] = `${general}%`;
              waypointProperties["General Status"] = getStatusFromLevel(general);
            }

            // Enhanced description with waste types
            const availableTypes = [];
            if (glass >= 0) availableTypes.push("Glass");
            if (aluminum >= 0) availableTypes.push("Aluminum");
            if (general >= 0) availableTypes.push("General Waste");

            if (availableTypes.length > 0) {
              description = `Waypoint ${index + 1} - Accepts: ${availableTypes.join(", ")}`;
            }
          }

          setPopupData({
            title: "Waypoint",
            description: description,
            properties: waypointProperties,
            fillData: container ? container.fillData : []
          });
          setIsPopupOpen(true);
        });
      });

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const data: RouteResponse = await response.json();

      // Remove existing route layer if it exists
      if (mapRef.current.getLayer(routeLayerId.current)) {
        mapRef.current.removeLayer(routeLayerId.current);
        mapRef.current.removeSource(routeLayerId.current);
      }

      if (data.routes && data.routes.length > 0) {
        // Add the route to the map
        mapRef.current.addSource(routeLayerId.current, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: data.routes[0].geometry.coordinates
            }
          }
        });

        mapRef.current.addLayer({
          id: routeLayerId.current,
          type: 'line',
          source: routeLayerId.current,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });

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
      }
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

    // Remove route layer and source if they exist
    if (mapRef.current.getLayer(routeLayerId.current)) {
      mapRef.current.removeLayer(routeLayerId.current);
      mapRef.current.removeSource(routeLayerId.current);
    }

    // Close popup
    closePopup();
  };

  // Toggle the placing mode
  const togglePlacingMode = () => {
    setIsPlacingMode(prev => !prev);
  };

  // Helper function to get status text from fill level
  const getStatusFromLevel = (level: number): string => {
    if (level >= 80) return "Nearly Full";
    if (level >= 50) return "Half Full";
    return "Available";
  };

  // Helper function to calculate maximum fill level from waste types
  const getMaxFillLevel = (wasteTypes: WasteTypes): number => {
    const { glass, aluminum, general } = wasteTypes;
    const availableLevels = [
      glass >= 0 ? glass : 0,
      aluminum >= 0 ? aluminum : 0,
      general >= 0 ? general : 0
    ];
    return Math.max(...availableLevels);
  };

  // Function to add a custom point at clicked location
  const addCustomPoint = (e: mapboxgl.MapMouseEvent) => {
    if (!mapRef.current) return;

    const { lng, lat } = e.lngLat;
    const pointIndex = customPoints.length;

    console.log(`Adding point at ${lng}, ${lat}. Total points: ${pointIndex + 1}`);

    // Add to state
    setCustomPoints(prevPoints => [...prevPoints, { lng, lat }]);

    // Create a container for the marker with a custom attribute
    const markerContainer = document.createElement('div');
    markerContainer.className = 'custom-marker-container';
    markerContainer.setAttribute('data-custom-point', 'true');

    // Create the marker dot
    const markerDot = document.createElement('div');
    markerDot.className = 'custom-marker-dot';
    markerDot.style.backgroundColor = '#888';
    markerDot.style.width = '20px';
    markerDot.style.height = '20px';
    markerDot.style.borderRadius = '50%';
    markerDot.style.border = '2px solid white';
    markerDot.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';

    // Add the dot to the container
    markerContainer.appendChild(markerDot);

    // Add marker to map
    const marker = new mapboxgl.Marker({ element: markerContainer })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    // Add click handler for the marker
    marker.getElement().addEventListener('click', (event) => {
      event.stopPropagation();

      if (!isPlacingMode) {
        setPopupData({
          title: "Custom Point",
          description: "User-defined location point",
          properties: {
            "Longitude": lng.toFixed(6),
            "Latitude": lat.toFixed(6),
            "Point #": pointIndex + 1
          },
          fillData: []
        });
        setIsPopupOpen(true);
      }
    });
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
    
    // Create CSV content
    let csvContent = "id,longitude,latitude\n";
    
    customPoints.forEach((point, index) => {
      csvContent += `${index + 1},${point.lng.toFixed(6)},${point.lat.toFixed(6)}\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set up and trigger download
    link.setAttribute('href', url);
    link.setAttribute('download', `custom-points-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
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

    // Find all marker elements on the page
    const markers = document.querySelectorAll('.mapboxgl-marker');
    console.log(`Found ${markers.length} markers`);

    // Loop through each marker and remove custom ones
    let removedCount = 0;
    markers.forEach(marker => {
      // Check if this marker has our custom attribute
      const customContainer = marker.querySelector('.custom-marker-dot');
      if (customContainer) {
        marker.remove();
        removedCount++;
      }
    });

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
        // Calculate max fill level from waste types
        const { glass, aluminum, general } = container.waste_types;
        const maxFillLevel = getMaxFillLevel(container.waste_types);

        // Determine marker color based on maximum fill level
        let markerColor;
        if (maxFillLevel < 30) {
          markerColor = '#4CAF50'; // Green for low fill level
        } else if (maxFillLevel < 70) {
          markerColor = '#FF9800'; // Orange for medium fill level
        } else {
          markerColor = '#F44336'; // Red for high fill level
        }

        // Create a container element for the marker
        const el = document.createElement('div');
        // el.style.position = 'relative';
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = markerColor;
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        // Add waste type indicators
        const availableTypes = [];
        if (glass >= 0) availableTypes.push('G');
        if (aluminum >= 0) availableTypes.push('A');
        if (general >= 0) availableTypes.push('W');

        if (availableTypes.length > 0) {
          const typeIndicator = document.createElement('div');
          typeIndicator.style.position = 'absolute';
          typeIndicator.style.top = '-8px';
          typeIndicator.style.right = '-8px';
          typeIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
          typeIndicator.style.color = 'white';
          typeIndicator.style.fontSize = '8px';
          typeIndicator.style.fontWeight = 'bold';
          typeIndicator.style.padding = '2px 3px';
          typeIndicator.style.borderRadius = '3px';
          typeIndicator.textContent = availableTypes.join('');
          el.appendChild(typeIndicator);
        }

        // Create marker with custom element
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([container.lng, container.lat])
          .addTo(map);

        // Add click handler for the marker
        marker.getElement().addEventListener('click', () => {
          // Create base properties for popup
          const properties: Record<string, any> = {
            "Longitude": container.lng,
            "Latitude": container.lat,
            "Max Fill Level": `${maxFillLevel}%`,
            "Status": getStatusFromLevel(maxFillLevel)
          };

          // Add waste type information
          // Glass
          if (glass >= 0) {
            properties["Glass"] = `${glass}%`;
            properties["Glass Status"] = getStatusFromLevel(glass);
          }

          // Aluminum
          if (aluminum >= 0) {
            properties["Aluminum"] = `${aluminum}%`;
            properties["Aluminum Status"] = getStatusFromLevel(aluminum);
          }

          // General waste
          if (general >= 0) {
            properties["General Waste"] = `${general}%`;
            properties["General Status"] = getStatusFromLevel(general);
          }

          // Generate description based on available waste types
          const availableTypeNames = [];
          if (glass >= 0) availableTypeNames.push("Glass");
          if (aluminum >= 0) availableTypeNames.push("Aluminum");
          if (general >= 0) availableTypeNames.push("General Waste");

          const description = availableTypeNames.length > 0
            ? `Container accepting: ${availableTypeNames.join(", ")}`
            : "Container details";

          // Set popup data
          setPopupData({
            title: "Waste Container",
            description: description,
            properties: properties,
            fillData: container.fillData
          });

          setIsPopupOpen(true);
        });
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