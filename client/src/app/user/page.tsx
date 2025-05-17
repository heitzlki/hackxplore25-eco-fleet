'use client';

import { useState, useEffect, useRef } from 'react';
import MapView from '@/app/map/map-view';
import { PopupInfo } from '@/lib/map-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { X, CalendarIcon, ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react';
import { useStore } from '@/lib/store';
import RouteDisplay from './_components/route-display';
import { DayContent } from 'react-day-picker';

// Custom day component that can show multiple dots
function CustomDay(props: React.ComponentProps<typeof DayContent>) {
  const { date, activeModifiers } = props;
  
  // Check which modifiers apply to this day
  const hasBio = activeModifiers?.bio;
  const hasRecycling = activeModifiers?.recycling;
  const hasSpecial = activeModifiers?.special;
  const hasGeneral = activeModifiers?.general;
  
  // Only add dots container if at least one modifier applies
  const showDots = hasBio || hasRecycling || hasSpecial || hasGeneral;
  
  return (
    <div className="calendar-day">
      <DayContent {...props} />
      {showDots && (
        <div className="dot-container">
          {hasBio && <div className="dot dot-bio" title="Bio waste collection" />}
          {hasRecycling && <div className="dot dot-recycling" title="Recycling collection" />}
          {hasSpecial && <div className="dot dot-special" title="Special collection" />}
          {hasGeneral && <div className="dot dot-general" title="General waste collection" />}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  // Use the global store for popup state
  const {
    mapViewState: { isPopupOpen, popupData },
    setPopupOpen,
    setPopupData
  } = useStore();
  // Bin UI state
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Recycling popup state
  const [isRecyclingPopupOpen, setIsRecyclingPopupOpen] = useState(false);
  const [isRecyclingPopupVisible, setIsRecyclingPopupVisible] = useState(false);
  const [showRecyclingCalendar, setShowRecyclingCalendar] = useState(false);
  const [recyclingDate, setRecyclingDate] = useState<Date | undefined>(new Date());
  const [expandedWasteType, setExpandedWasteType] = useState<string | null>(null);
  const recyclingPopupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update visibility when popup state changes
  useEffect(() => {
    // update left Bin popup visibility
    if (isPopupOpen) {
      // Add a small delay before showing the popup to ensure the DOM is updated
      setTimeout(() => {
        setIsPopupVisible(true);
      }, 50);
    } else {
      setIsPopupVisible(false);
    }
  }, [isPopupOpen]);

  // Update right ecycling popup visibility
  useEffect(() => {
    console.log('Recycling popup state changed:', { isRecyclingPopupOpen });
    if (isRecyclingPopupOpen) {
      // Add a small delay before showing the popup to ensure the DOM is updated
      setTimeout(() => {
        setIsRecyclingPopupVisible(true);
      }, 50);
    } else {
      setIsRecyclingPopupVisible(false);
    }
  }, [isRecyclingPopupOpen]);
  
  // Function to handle marker clicks
  const handleMarkerClick = (data: PopupInfo) => {
    // Clear any existing timeout
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }
    
    setPopupData(data);
    setPopupOpen(true);
  };

  // Function to toggle calendar visibility
  const toggleCalendar = () => {
    setShowCalendar(prev => !prev);
  };

  // Function to toggle recycling popup
  const toggleRecyclingPopup = () => {
    console.log('Recycling popup toggled', { current: isRecyclingPopupOpen });
    if (recyclingPopupTimeoutRef.current) {
      clearTimeout(recyclingPopupTimeoutRef.current);
      recyclingPopupTimeoutRef.current = null;
    }
    
    setIsRecyclingPopupOpen(prev => !prev);
  };
  
  // Function to toggle recycling calendar
  const toggleRecyclingCalendar = () => {
    setShowRecyclingCalendar(prev => !prev);
  };
  
  // Function to toggle waste type details
  const toggleWasteTypeDetails = (wasteType: string) => {
    setExpandedWasteType(prev => prev === wasteType ? null : wasteType);
  };
  
  // Function to close the popup with animation
  const closePopup = () => {
    // First hide the popup with animation
    setIsPopupVisible(false);
    setShowCalendar(false);
    
    // Then remove it from the DOM after animation completes
    popupTimeoutRef.current = setTimeout(() => {
      setPopupOpen(false);
    }, 300); // Match this to the CSS transition duration
  };

  // Function to close the recycling popup
  const closeRecyclingPopup = () => {
    // First hide the popup with animation
    setIsRecyclingPopupVisible(false);
    setShowRecyclingCalendar(false);
    setExpandedWasteType(null);
    
    // Then remove it from the DOM after animation completes
    recyclingPopupTimeoutRef.current = setTimeout(() => {
      setIsRecyclingPopupOpen(false);
    }, 300); // Match this to the CSS transition duration
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
      if (recyclingPopupTimeoutRef.current) {
        clearTimeout(recyclingPopupTimeoutRef.current);
      }
    };
  }, []);

  // Function to set map reference when map is initialized
  const handleMapInit = (map: mapboxgl.Map) => {
    mapRef.current = map;
    setMapReady(true);
  };

  return (
    <MapView
      mode='dashboard'
      enableLocationTracking={true}
      className='h-screen w-full relative'
      onMarkerClick={handleMarkerClick}
      onMapInit={handleMapInit}
    >
      {/* Route Display Component */}
      {mapReady && (
        <RouteDisplay
          mapRef={mapRef}
          onMarkerClick={handleMarkerClick}
          onRouteCreated={(success) => console.log(`Route creation ${success ? 'succeeded' : 'failed'}`)}
        />
      )}
      
      {/* UI Controls Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Open Recycling Guide Button */}
        <Button
          className="absolute top-4 right-4 z-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg pointer-events-auto"
          onClick={toggleRecyclingPopup}
        >
          Recycling Guide
        </Button>
      </div>

      {/* Dashboard Mode Popup with Animation */}
      {isPopupOpen && (
        <div 
          className={`absolute top-4 left-4 z-50 w-80 transition-all duration-300 ease-in-out transform ${
            isPopupVisible 
              ? 'opacity-100 translate-x-0 scale-100' 
              : 'opacity-0 -translate-x-4 scale-95'
          }`}
        >
          <Card className="border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            {/* Removed gradient background for consistency */}
            <CardHeader className="pb-2 relative">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">{popupData.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{popupData.description}</CardDescription>
                  {/* {popupData.properties.containerIndex !== undefined && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Container Index: {popupData.properties.containerIndex}
                    </div>
                  )} */}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10" onClick={closePopup}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative">
              <div className="grid gap-2">
                {Object.entries(popupData.properties)
                  .filter(([key]) => key !== 'Longitude' && key !== 'Latitude')
                  .map(([key, value], index) => {
                    // Determine color based on value
                    let badgeColor = 'bg-secondary text-secondary-foreground';
                    
                    // Try to extract a numeric value if present
                    let numericValue: number | null = null;
                    
                    // Check if the value contains a percentage
                    if (typeof value === 'string' && value.includes('%')) {
                      const match = value.match(/\d+(\.\d+)?/);
                      if (match) {
                        numericValue = parseFloat(match[0]);
                      }
                    } 
                    // Otherwise try to convert the entire value to a number
                    else {
                      const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
                      if (!isNaN(parsed)) {
                        numericValue = parsed;
                      }
                    }
                    
                    // If we have a numeric value, color based on thresholds
                    if (numericValue !== null) {
                      if (numericValue < 30) {
                        badgeColor = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
                      } else if (numericValue < 70) {
                        badgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
                      } else {
                        badgeColor = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
                      }
                    } 
                    // For text values, check for status keywords
                    else if (typeof value === 'string') {
                      const textValue = value.toLowerCase();
                      if (textValue.includes('A') || textValue.includes('good') || textValue.includes('excellent')) {
                        badgeColor = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
                      } else if (textValue.includes('medium') || textValue.includes('moderate') || textValue.includes('average')) {
                        badgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
                      } else if (textValue.includes('high') || textValue.includes('critical') || textValue.includes('urgent') || textValue.includes('full')) {
                        badgeColor = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
                      }
                    }
                    
                    return (
                      <div 
                        key={key} 
                        className="flex justify-between items-center"
                        style={{ 
                          animation: `fadeIn 0.3s ease-out forwards ${index * 0.05 + 0.1}s`,
                          opacity: 0 
                        }}
                      >
                        <span className="text-sm text-muted-foreground">{key}</span>
                        <Badge 
                          className={`font-normal ${badgeColor}`}
                        >
                          {value}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
              
              <style jsx global>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateX(8px); }
                  to { opacity: 1; transform: translateX(0); }
                }
              `}</style>
            </CardContent>
            
            <CardFooter className="pt-0 flex justify-between items-center relative">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleCalendar}
                className="flex items-center gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
              >
                <CalendarIcon className="h-4 w-4" />
                {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={closePopup}
                className="transition-all hover:bg-primary hover:text-primary-foreground"
              >
                Close
              </Button>
            </CardFooter>
          </Card>
          
          {/* Calendar popup */}
          {showCalendar && (
            <div 
              className="mt-2 w-full transition-all duration-300 ease-in-out transform animate-in fade-in slide-in-from-left-2"
            >
              <Card className="border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Schedule Pickup</CardTitle>
                  <CardDescription className="text-xs">
                    Select a date for container pickup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    weekStartsOn={1}
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    modifiers={{
                      // Green dot on every Tuesday (bio waste)
                      bio: (date) => date.getDay() === 2,
                      
                      // Yellow dot on every Wednesday on even calendar weeks (recycling)
                      recycling: (date) => {
                        const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
                        return date.getDay() === 3 && weekNumber % 2 === 0;
                      },
                      
                      // Blue dot on every Tuesday every 4th week (special collection)
                      special: (date) => {
                        // Get the week number in the year
                        const startOfYear = new Date(date.getFullYear(), 0, 1);
                        const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
                        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
                        return date.getDay() === 2 && weekNumber % 4 === 0;
                      },
                      
                      // Grey dot on every Monday on even calendar weeks (general waste)
                      general: (date) => {
                        const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
                        return date.getDay() === 1 && weekNumber % 2 === 0;
                      }
                    }}
                    components={{
                      DayContent: CustomDay
                    }}
                    disabled={(date) => {
                      // Disable past dates and weekends
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const day = date.getDay();
                      return date < today || day === 0 || day === 6;
                    }}
                    initialFocus
                  />
                </CardContent>
                <CardFooter className="pt-0 flex flex-col justify-start items-start">
                  {date && <>
                    <span className="text-xs text-muted-foreground">
                      Selected: {date.toLocaleDateString()}
                    </span>
                    <div className="mt-2 flex flex-col gap-1">
                      {
                        date && (
                          <>
                            {/* Check for bio waste collection (every Tuesday) */}
                            {date.getDay() === 2 && (
                              <div className="flex items-center gap-2">
                                <div className="dot dot-bio w-3 h-3"></div>
                                <span className="text-xs">Bio waste</span>
                              </div>
                            )}
                            
                            {/* Check for recycling (Wednesdays on even weeks) */}
                            {date.getDay() === 3 && 
                              Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7) % 2 === 0 && (
                              <div className="flex items-center gap-2">
                                <div className="dot dot-recycling w-3 h-3"></div>
                                <span className="text-xs">Valuable waste</span>
                              </div>
                            )}
                            
                            {/* Check for special collection (Tuesdays every 4th week) */}
                            {date.getDay() === 2 && 
                              (() => {
                                const startOfYear = new Date(date.getFullYear(), 0, 1);
                                const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
                                const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
                                return weekNumber % 4 === 0;
                              })() && (
                              <div className="flex items-center gap-2">
                                <div className="dot dot-special w-3 h-3"></div>
                                <span className="text-xs">Paper waste</span>
                              </div>
                            )}
                            
                            {/* Check for general waste (Mondays on even weeks) */}
                            {date.getDay() === 1 && 
                              Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7) % 2 === 0 && (
                              <div className="flex items-center gap-2">
                                <div className="dot dot-general w-3 h-3"></div>
                                <span className="text-xs">Residual waste</span>
                              </div>
                            )}
                            
                            {/* If no collections on this day */}
                            {!(date.getDay() === 2 || 
                               (date.getDay() === 3 && Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7) % 2 === 0) || 
                               (date.getDay() === 1 && Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7) % 2 === 0)) && (
                              <span className="text-xs text-muted-foreground">No trash service on this day</span>
                            )}
                          </>
                        )
                      }
                    </div>
                  </>}
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Recycling Information Popup */}
      {isRecyclingPopupOpen && (
        <div 
          className={`absolute top-4 right-4 z-50 w-80 transition-all duration-300 ease-in-out transform ${
            isRecyclingPopupVisible 
              ? 'opacity-100 translate-x-0 scale-100' 
              : 'opacity-0 translate-x-4 scale-95'
          }`}
        >
          <Card className="border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden text-white">
            {/* Removed gradient background for consistency */}
            <CardHeader className="pb-2 relative">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">Recycling Guide</CardTitle>
                  <CardDescription className="text-sm mt-1 text-gray-300">How to recycle different materials</CardDescription>
                  <p className="text-xs text-blue-400 mt-1">Click on any item for detailed guidelines</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-blue-500/10" onClick={closeRecyclingPopup}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative">
              <div className="grid gap-2">
                {[
                  { 
                    key: "Glass", 
                    value: "Rinse and separate by color",
                    details: "Clean glass items should be separated by color (clear, green, brown). Remove any non-glass parts like metal lids or plastic caps. Broken glass should be wrapped and labeled clearly before disposal.",
                    link: "https://citywebsite.gov/recycling/glass"
                  },
                  { 
                    key: "Aluminum", 
                    value: "Rinse, remove labels",
                    details: "Rinse aluminum cans and containers to remove food residue. Crush if possible to save space. Aluminum foil should be cleaned and rolled into a ball before recycling.",
                    link: "https://citywebsite.gov/recycling/metal"
                  },
                  { 
                    key: "Paper", 
                    value: "Keep dry, bundle together",
                    details: "Flatten cardboard boxes. Remove staples, paper clips, and plastic wrapping. \n \nCollected every Tuesday \nNext collections: \n Mi. den 11.06.2025 \n",
                    link: "https://citywebsite.gov/recycling/paper"
                  },
                  { 
                    key: "Plastic", 
                    value: "Check recycling number",
                    details: "Look for the recycling number (1-7) inside the triangle symbol. Most municipalities accept #1 (PET) and #2 (HDPE). Rinse containers and remove caps. Plastic bags usually require special recycling at grocery stores.",
                    link: "https://citywebsite.gov/recycling/plastic"
                  },
                  { 
                    key: "Batteries", 
                    value: "Special collection points",
                    details: "Never dispose of batteries in regular trash. Household batteries can be taken to designated collection points. Rechargeable and lithium-ion batteries should be taken to electronic retailers or hazardous waste facilities.",
                    link: "https://tsk.karlsruhe.de/unsere-leistungen/entsorgungseinrichtungen#c168089"
                  },
                  { 
                    key: "Electronics", 
                    value: "Return to collection center",
                    details: "Electronics contain hazardous materials and valuable recyclable components. Take to designated e-waste collection centers. Some retailers offer take-back programs for old electronics. Wipe personal data before recycling computers and phones.",
                    link: "https://tsk.karlsruhe.de/unsere-leistungen/entsorgungseinrichtungen#c168023"
                  }
                ].map((item, index) => (
                  <div key={item.key} className="mb-2">
                    <div 
                      className={`flex justify-between items-center cursor-pointer ${expandedWasteType === item.key ? 'bg-blue-800/40 rounded-t-md border-t border-l border-r border-blue-700' : 'hover:bg-blue-900/30 rounded-md'} p-1`}
                      onClick={() => toggleWasteTypeDetails(item.key)}
                      style={{ 
                        animation: `fadeInRight 0.3s ease-out forwards ${index * 0.05 + 0.1}s`,
                        opacity: 0 
                      }}
                    >
                      <div className="flex items-center">
                        <Info className="h-3 w-3 text-blue-400 mr-1.5" />
                        <span className="text-sm text-gray-300">{item.key}</span>
                      </div>
                      <div className="flex items-center">
                        <Badge className="font-normal bg-blue-900 text-blue-100 mr-2">
                          {item.value}
                        </Badge>
                        {expandedWasteType === item.key ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedWasteType === item.key && (
                      <div 
                        className="text-sm text-gray-400 mt-0 p-3 border border-blue-700 rounded-b-md bg-blue-900/20 animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        <p className="mb-2">{item.details}</p>
                        {item.key === "Plastic" && (
                          <div className="mb-2 bg-blue-950/50 p-2 rounded-md">
                            <span className="font-semibold text-xs text-blue-300">Plastic Recycling Numbers:</span>
                            <ul className="text-xs list-disc ml-4 mt-1">
                              <li>#1 (PET): Water bottles, soda bottles</li>
                              <li>#2 (HDPE): Milk jugs, detergent bottles</li>
                              <li>#5 (PP): Yogurt containers, bottle caps</li>
                            </ul>
                          </div>
                        )}
                        {item.key === "Batteries" && (
                          <div className="mb-2 bg-blue-950/50 p-2 rounded-md">
                            <span className="font-semibold text-xs text-blue-300">Local Drop-off Locations Südweststadt:</span>
                            <ul className="text-xs list-disc ml-4 mt-1">
                              <li>Bahnhof­straße gegenüber Nr. 42</li>
                              <li>Beiert­hei­mer Allee 2 (vor Landrat­samt)</li>
                              <li>Ernst-Frey-Straße/­Stein­häu­ser­straße</li>
                            </ul>
                          </div>
                        )}
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center text-xs mt-2"
                        >
                          More dropoff locations <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <style jsx global>{`
                @keyframes fadeInRight {
                  from { opacity: 0; transform: translateX(-8px); }
                  to { opacity: 1; transform: translateX(0); }
                }
              `}</style>
            </CardContent>
            
            <CardFooter className="pt-0 flex justify-between items-center relative">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={closeRecyclingPopup}
                className="transition-all hover:bg-blue-500 hover:text-white border-gray-600"
              >
                Close
              </Button>
            </CardFooter>
          </Card>

        </div>
      )}
    </MapView>
  );
}
