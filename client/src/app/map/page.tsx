'use client'
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from "@/lib/environment";


export default function Page() {

  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [center, setCenter] = useState<any>([8.403735115313623, 49.00791069535478])
  const [zoom, setZoom] = useState(17.5)

  useEffect(() => {
    let mapInstance: mapboxgl.Map | null = null;
    
    (async () => {
      if (!mapContainerRef.current) return; // Safety check
  
      mapboxgl.accessToken = (await environment()).mapBoxAccessToken
  
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/zhgr/cmar8hvo600o101s57dnw4vvb', // Add a default style
        projection: "globe",
        center: center, // Default center (adjust as needed)
        zoom: zoom, // Default zoom level
        antialias: true,
        pitch: 70,
        bearing: -45
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
      
      mapRef.current = map;
      mapInstance = map;
      
    })()

    return () => {
      // Use the local variable which is guaranteed to be in scope
      if (mapInstance) {
        mapInstance.remove();
      }
      // Also clean up the ref
      if (mapRef.current) {
        mapRef.current.remove();
      }
    }

  }, [])



  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div ref={mapContainerRef} className="h-full w-full relative z-0"></div>
      {/* kirills stuff here */}
    </div>
  );
}