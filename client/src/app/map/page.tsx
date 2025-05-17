'use client';

import MapView from './map-view';
import { PopupInfo } from '@/lib/map-utils';
import { MapPopup } from '@/components/ui/map-popup';
import MainStats from './main-stats';
import ControlCenter from './control-center';
import { useStore } from '@/lib/store';

export default function Map() {
  // Use the global store for popup state
  const { 
    mapViewState: { isPopupOpen, popupData },
    setPopupOpen,
    setPopupData
  } = useStore();
  
  // Function to handle marker clicks
  const handleMarkerClick = (data: PopupInfo) => {
    setPopupData(data);
    setPopupOpen(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div className='relative h-screen w-screen'>
      <MapView 
        mode='map'
        enableLocationTracking={false}
        className='h-screen w-screen relative overflow-hidden cursor-none z-0'
        onMarkerClick={handleMarkerClick}
      >
        {/* Map Mode Popup */}
        <MapPopup 
          isOpen={isPopupOpen} 
          onClose={closePopup}
          title={popupData.title}
          description={popupData.description}
          properties={popupData.properties}
          fillData={popupData.fillData || []}
        />
      </MapView>
      <MainStats />
      {/* <ControlCenter /> */}
    </div>
  );
}
