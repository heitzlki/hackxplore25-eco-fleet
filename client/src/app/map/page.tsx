'use client'
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from "@/lib/environment";
import { MapPopup } from "@/components/ui/map-popup";
import { FillData, useStore } from "@/lib/store"; // Import the Zustand store hook
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

export default function Page() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const routeLayerId = useRef<string>("route-layer");
  const [center, setCenter] = useState<any>([8.403735115313623, 49.00791069535478])
  const [zoom, setZoom] = useState(17.5)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);


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

      // only use the first 3 waypoints for the route
      // const limitedWaypoints = waypoints.slice(0, 3);

      const response = await fetch(`/api/mapbox/route?waypoints=${waypoints.join(';')}`);

      // Highlight the used waypoints with an order index
      waypoints.forEach((waypoint, index) => {
        const [lng, lat] = waypoint.split(',').map(Number);
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
          setPopupData({
        title: "Waypoint",
        description: `Waypoint ${index + 1}`,
        properties: {
          "Longitude": lng,
          "Latitude": lat,
          "Order": index + 1
        },
        fillData: []
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

  useEffect(() => {
    (async () => {
      if (!mapContainerRef.current) return; // Safety check

      mapboxgl.accessToken = (await environment()).mapBoxAccessToken

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/zhgr/cmarabpiy01pw01sl35e50m1p', // Add a default style
        projection: "globe",
        center: center, // Default center (adjust as needed)
        zoom: zoom, // Default zoom level
        antialias: true,
        pitch: 30,
        bearing: 0
      });

      map.on('move', () => {
        // get the current center coordinates and zoom level from the map
        const mapCenter = map.getCenter()
        const mapZoom = map.getZoom()

        // update state
        setCenter([mapCenter.lng, mapCenter.lat])
        setZoom(mapZoom)
      })

      mapRef.current = map;

      // Add garbage container markers from the Zustand store
      garbageContainers.forEach((container) => {
        // Create a marker for each garbage container
        const marker = new mapboxgl.Marker({ color: '#000' })
          .setLngLat([container.lng, container.lat]) // Note: The store has lat/lng reversed compared to mapbox expectations
          .addTo(map);

        // Optional: Add a popup that appears on click
        marker.getElement().addEventListener('click', () => {
          setPopupData({
            title: "Garbage Container",
            description: "Location details for this container",
            properties: {
              "Longitude": container.lng,
              "Latitude": container.lat
            },
            fillData: container.fillData
          });
          setIsPopupOpen(true);
        });
      });

    })()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [])

  return (
    <div className="h-screen w-screen relative overflow-hidden cursor-none">
      <div ref={mapContainerRef} className="h-full w-full relative z-0"></div>
      <Pointer className="fill-blue-500" />

      {/* Test buttons to manually open popups */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          onClick={requestRoute}
          disabled={isLoadingRoute}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {isLoadingRoute ? 'Calculating Route...' : 'Calculate Optimal Route'}
        </Button>

        <Button
          onClick={clearRoute}
          className="bg-slate-600 hover:bg-slate-700 text-white"
        >
          Clear Route
        </Button>

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
          className="bg-primary text-white"
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
          className="bg-secondary text-white"
        >
          Show Environment Data
        </Button>

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