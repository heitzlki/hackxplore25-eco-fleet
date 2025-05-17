'use client';

import { useState, useEffect, useRef } from 'react';
import MapView from '@/app/map/map-view';
import { PopupInfo } from '@/lib/map-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { X, CalendarIcon } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Dashboard() {
  // Use the global store for popup state
  const { 
    mapViewState: { isPopupOpen, popupData },
    setPopupOpen,
    setPopupData
  } = useStore();
  
  // Local UI state
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update visibility when popup state changes
  useEffect(() => {
    if (isPopupOpen) {
      // Add a small delay before showing the popup to ensure the DOM is updated
      setTimeout(() => {
        setIsPopupVisible(true);
      }, 50);
    } else {
      setIsPopupVisible(false);
    }
  }, [isPopupOpen]);
  
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
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  return (
    <MapView 
      mode='dashboard'
      enableLocationTracking={true}
      className='h-screen w-full relative'
      onMarkerClick={handleMarkerClick}
    >
      {/* Dashboard Mode Popup with Animation */}
      {isPopupOpen && (
        <div 
          className={`absolute top-4 right-4 z-50 w-80 transition-all duration-300 ease-in-out transform ${
            isPopupVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 -translate-y-4 scale-95'
          }`}
        >
          <Card className="border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
            <CardHeader className="pb-2 relative">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">{popupData.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{popupData.description}</CardDescription>
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
                      if (textValue.includes('low') || textValue.includes('good') || textValue.includes('excellent')) {
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
                  from { opacity: 0; transform: translateY(8px); }
                  to { opacity: 1; transform: translateY(0); }
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
              className="mt-2 w-full transition-all duration-300 ease-in-out transform animate-in fade-in slide-in-from-top-2"
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
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
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
                <CardFooter className="pt-0 flex justify-end">
                  {date && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Selected: {date.toLocaleDateString()}
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Confirm Pickup
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      )}
    </MapView>
  );
}
