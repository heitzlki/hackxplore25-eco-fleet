'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  DownloadCloud,
  X,
  AreaChart,
  Route,
  Target,
  Map as MapIcon,
} from 'lucide-react';
import FillGraph from '@/components/map-dashboard/FillGraph';

export default function MainStats() {
  const {
    garbageContainers,
    mapViewState: {
      isPopupOpen,
      popupData,
      customPoints,
      isPlacingMode,
      center,
      zoom,
    },
    togglePlacingMode,
    clearCustomPoints,
    setLoadingRoute,
  } = useStore();

  // Calculate average fill level across all containers
  const calculateAverageFillLevel = () => {
    if (garbageContainers.length === 0) return 0;

    let totalFill = 0;
    let count = 0;

    garbageContainers.forEach((container) => {
      if (container.fillData && container.fillData.length > 0) {
        // Get the most recent fill level
        const latestFill =
          container.fillData[container.fillData.length - 1].fillLevel;
        totalFill += latestFill;
        count++;
      }
    });

    return count > 0 ? Math.round((totalFill / count) * 100) / 100 : 0;
  };

  // Get the count of containers that need attention (fill level > 75%)
  const getContainersNeedingAttention = () => {
    return garbageContainers.filter((container) => {
      if (container.fillData && container.fillData.length > 0) {
        const latestFill =
          container.fillData[container.fillData.length - 1].fillLevel;
        return latestFill > 0.75;
      }
      return false;
    }).length;
  };

  // Format coordinates for display
  const formatCoordinates = (coords: [number, number]) => {
    return `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
  };

  // Download points as CSV
  const downloadPointsAsCSV = () => {
    // Implementation would go here or could be imported from map-utils
  };

  return (
    <Card className='w-[350px] absolute top-24 right-4 z-10 pointer-events-auto shadow-lg'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex justify-between items-center'>
          <span>Map Dashboard</span>
          <Badge variant={isPlacingMode ? 'destructive' : 'outline'}>
            {isPlacingMode ? 'Placing Mode' : 'View Mode'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Monitor status and manage map features
        </CardDescription>
      </CardHeader>

      <Tabs defaultValue='stats' className='w-full'>
        <TabsList className='grid grid-cols-3 w-full'>
          <TabsTrigger value='stats'>
            <AreaChart className='h-4 w-4 mr-1' /> Stats
          </TabsTrigger>
          <TabsTrigger value='points'>
            <MapPin className='h-4 w-4 mr-1' /> Points
          </TabsTrigger>
          <TabsTrigger value='map'>
            <MapIcon className='h-4 w-4 mr-1' /> Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value='stats'>
          <CardContent className='pt-4'>
            <div className='space-y-3'>
              <div>
                <h3 className='text-sm font-medium mb-1'>
                  Fill Level Overview
                </h3>
                {/* <FillGraph data={garbageContainers[0]?.fillData || []} /> */}
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <div className='bg-muted p-2 rounded-lg'>
                  <p className='text-xs text-muted-foreground'>Average Fill</p>
                  <p className='text-lg font-semibold'>
                    {calculateAverageFillLevel()}%
                  </p>
                </div>
                <div className='bg-muted p-2 rounded-lg'>
                  <p className='text-xs text-muted-foreground'>
                    Attention Needed
                  </p>
                  <p className='text-lg font-semibold'>
                    {getContainersNeedingAttention()}
                  </p>
                </div>
                <div className='bg-muted p-2 rounded-lg'>
                  <p className='text-xs text-muted-foreground'>
                    Total Containers
                  </p>
                  <p className='text-lg font-semibold'>
                    {garbageContainers.length}
                  </p>
                </div>
                <div className='bg-muted p-2 rounded-lg'>
                  <p className='text-xs text-muted-foreground'>Custom Points</p>
                  <p className='text-lg font-semibold'>{customPoints.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value='points'>
          <CardContent className='pt-4'>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <h3 className='text-sm font-medium'>
                  Custom Points ({customPoints.length})
                </h3>
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={customPoints.length === 0}
                  onClick={clearCustomPoints}>
                  <X className='h-4 w-4' />
                </Button>
              </div>

              <div className='max-h-48 overflow-y-auto space-y-2'>
                {customPoints.length === 0 ? (
                  <p className='text-sm text-muted-foreground text-center py-4'>
                    No custom points added yet
                  </p>
                ) : (
                  customPoints.map((point, index) => (
                    <div
                      key={index}
                      className='bg-muted p-2 rounded-lg text-xs'>
                      <p className='font-medium'>Point #{index + 1}</p>
                      <p className='text-muted-foreground'>
                        Lng: {point.lng.toFixed(5)}, Lat: {point.lat.toFixed(5)}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className='pt-2'>
                <Button
                  className='w-full'
                  variant='outline'
                  onClick={() => togglePlacingMode()}>
                  <Target className='h-4 w-4 mr-2' />
                  {isPlacingMode ? 'Exit Placing Mode' : 'Enter Placing Mode'}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className='pt-0'>
            <Button
              className='w-full'
              variant='default'
              size='sm'
              disabled={customPoints.length === 0}
              onClick={downloadPointsAsCSV}>
              <DownloadCloud className='h-4 w-4 mr-2' />
              Download Points as CSV
            </Button>
          </CardFooter>
        </TabsContent>

        <TabsContent value='map'>
          <CardContent className='pt-4'>
            <div className='space-y-3'>
              <div>
                <h3 className='text-sm font-medium mb-1'>Map Information</h3>
                <div className='bg-muted p-2 rounded-lg'>
                  <p className='text-xs text-muted-foreground'>
                    Current Position
                  </p>
                  <p className='text-sm font-medium truncate'>
                    {formatCoordinates(center)}
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <div className='bg-muted p-2 rounded-lg'>
                  <p className='text-xs text-muted-foreground'>Zoom Level</p>
                  <p className='text-lg font-semibold'>{zoom.toFixed(1)}</p>
                </div>
                <div className='bg-muted p-2 rounded-lg'>
                  <p className='text-xs text-muted-foreground'>Mode</p>
                  <p className='text-sm font-medium'>
                    {isPlacingMode ? 'Placing' : 'Viewing'}
                  </p>
                </div>
              </div>

              {isPopupOpen && (
                <div className='bg-accent/30 p-2 rounded-lg'>
                  <p className='text-xs font-medium'>Active Popup</p>
                  <p className='text-sm truncate'>{popupData.title}</p>
                  <p className='text-xs text-muted-foreground truncate'>
                    {popupData.description}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className='pt-0'>
            <Button
              className='w-full'
              variant='outline'
              size='sm'
              onClick={() => setLoadingRoute(true)}>
              <Route className='h-4 w-4 mr-2' />
              Calculate Optimal Route
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
