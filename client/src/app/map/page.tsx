'use client'
import { ReactNode, useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from "@/lib/environment";
import { MapPopup } from "@/components/ui/map-popup";
import { Button } from "@/components/ui/button";

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
  }>({
    title: "",
    description: "",
    properties: {}
  })

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false)
  }

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

        const geometry: any = feature.geometry;
        const properties: any = feature.properties;

        // Updated to use the Shadcn popup component
        setPopupData({
          title: properties.title || "Location Information",
          description: properties.description || "No description available",
          properties: properties || {}
        });
        setIsPopupOpen(true);
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
      
      {/* Test button to manually open the popup */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
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
        </Button>
      </div>
      
      {/* Shadcn Popup Component */}
      <MapPopup 
        isOpen={isPopupOpen}
        onClose={closePopup}
        title={popupData.title}
        description={popupData.description}
        properties={popupData.properties}
      />
      
      {/* Legacy popups array (keeping for compatibility) */}
      {popups}
    </div>
  );
}