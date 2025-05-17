import { NextResponse } from 'next/server';
import { environment } from '@/lib/environment';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    let waypointsParam = searchParams.get('waypoints');
    
    // Check if waypoints is a string with semicolons (multiple points)
    let waypoints: string[] = [];
    
    if (waypointsParam && waypointsParam.includes(';')) {
      // The waypoints are already in format "lng,lat;lng,lat;lng,lat"
      waypoints = waypointsParam.split(';');
    } else if (waypointsParam) {
      // The waypoints are in a different format, try to parse
      waypoints = waypointsParam.split(',');
      
      // If we have an even number of coordinates, pair them properly
      if (waypoints.length >= 4 && waypoints.length % 2 === 0) {
        const pairedWaypoints: string[] = [];
        for (let i = 0; i < waypoints.length; i += 2) {
          pairedWaypoints.push(`${waypoints[i]},${waypoints[i + 1]}`);
        }
        waypoints = pairedWaypoints;
      }
    }
  
    // Ensure we have at least 2 waypoints for a route
    if (!waypoints || waypoints.length < 2) {
      // Use default waypoints for testing if none provided
      // These should represent garbage container locations
      waypoints = [
        "8.403545,49.009544",
        "8.404323,49.009504",
        "8.403469,49.009014",
        "8.404302,49.008968"
      ];
    }
  
    try {
      // Format: /directions/v5/{profile}/{coordinates}
      const coordinates = waypoints.join(';');
      const env = await environment();
      
      // Use the environment function to get the access token
      const accessToken = env.mapBoxAccessToken;
      
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`;
      
      console.log('Fetching Mapbox route with waypoints:', waypoints.length);
      const res = await fetch(url);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Mapbox API error:', errorText);
        return NextResponse.json(
          { error: `Mapbox API error: ${res.status} ${res.statusText}` },
          { status: res.status }
        );
      }
  
      const data = await res.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching Mapbox route:', error);
      return NextResponse.json(
        { error: 'Failed to fetch route from Mapbox API' },
        { status: 500 }
      );
    }
}