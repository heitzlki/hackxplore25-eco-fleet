'use client'
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from "@/lib/environment";
import { MapPopup } from "@/components/ui/map-popup";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Define a type for our popup data
interface PopupInfo {
  title: string;
  description: string;
  properties: Record<string, any>;
}

export default function Page() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [center, setCenter] = useState<any>([8.403735115313623, 49.00791069535478])
  const [zoom, setZoom] = useState(17.5)
  
  // Single popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupInfo>({
    title: "Location Information",
    description: "No description available",
    properties: {}
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
        console.log(mapCenter);
      })
      
      map.on('click', (event) => {
        const features = map.queryRenderedFeatures(event.point, {
          layers: ['garbage-containers']
        })
        if (!features.length) {
          return;
        }

        const feature = features[0];
        const properties: any = feature.properties;

        // Create a new popup with the feature data
        openPopup({
          title: properties.title || "Container Information",
          description: properties.description || "Details about this waste container",
          properties: properties || {}
        });
      })

      mapRef.current = map; 
    })()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [])

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div ref={mapContainerRef} className="h-full w-full relative z-0"></div>
      
      {/* Test buttons to manually open popups */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
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
              }
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
              }
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
        position={{ x: 24, y: 80 }} // Fixed position on the left side
      />
    </div>
  );
}