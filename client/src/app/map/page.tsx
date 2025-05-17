'use client'
import { ReactNode, useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from "@/lib/environment";
import { MapPopup } from "@/components/ui/map-popup";
import { FillData, useStore } from "@/lib/store"; // Import the Zustand store hook
import { Pointer } from "@/components/magicui/pointer";
import { motion } from "motion/react";


export default function Page() {

  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [center, setCenter] = useState<any>([8.403735115313623, 49.00791069535478])
  const [zoom, setZoom] = useState(17.5)
  const [popups, setPopups] = useState<ReactNode[]>([])
  
  // New state for the popup
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupData, setPopupData] = useState<{
    title: string;
    description: string;
    properties: Record<string, any>;
    fillData: FillData
  }>({
    title: "",
    description: "",
    properties: {},
    fillData: []
  })

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const { garbageContainers } = useStore();

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
        setCenter([ mapCenter.lng, mapCenter.lat ])
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

  }, [garbageContainers]) // Add garbageContainers as a dependency to re-run the effect when the containers change



  return (
    <div className="h-screen w-screen relative overflow-hidden cursor-none">
      <div ref={mapContainerRef} className="h-full w-full relative z-0"></div>
      <Pointer className="fill-blue-500" />
      
      {/* Test button to manually open the popup */}
      <div className="absolute top-4 right-4 z-10">
        {/* <Button 
          onClick={() => {
            setPopupData({
              title: "Test Location",
              description: "This is a test popup for demonstration purposes",
              properties: {
                "Type": "Test Feature",
                "Coordinates": "Sample coordinates",
                "Status": "Active"
              }
            });
            setIsPopupOpen(true);
          }}
          className="bg-primary text-white"
        >
          Open Test Popup
        </Button> */}
      </div>
      
      {/* Shadcn Popup Component */}
      <MapPopup 
        isOpen={isPopupOpen}
        onClose={closePopup}
        title={popupData.title}
        description={popupData.description}
        properties={popupData.properties}
        fillData={popupData.fillData}
      />
      
      {/* Legacy popups array (keeping for compatibility) */}
      {popups}
    </div>
  );
}