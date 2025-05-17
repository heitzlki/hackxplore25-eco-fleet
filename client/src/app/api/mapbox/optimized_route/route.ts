import { NextResponse } from 'next/server';
import { environment as env } from '@/lib/environment';

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     let waypointsParam = searchParams.get('waypoints');
    
//     // Check if waypoints is a string with semicolons (multiple points)
//     let waypoints: string[] = [];
    
//     if (waypointsParam && waypointsParam.includes(';')) {
//       // The waypoints are already in format "lng,lat;lng,lat;lng,lat"
//       waypoints = waypointsParam.split(';');
//     } else if (waypointsParam) {
//       // The waypoints are in a different format, try to parse
//       waypoints = waypointsParam.split(',');
      
//       // If we have an even number of coordinates, pair them properly
//       if (waypoints.length >= 4 && waypoints.length % 2 === 0) {
//         const pairedWaypoints: string[] = [];
//         for (let i = 0; i < waypoints.length; i += 2) {
//           pairedWaypoints.push(`${waypoints[i]},${waypoints[i + 1]}`);
//         }
//         waypoints = pairedWaypoints;
//       }
//     }
  
//     // Ensure we have at least 2 waypoints for a route
//     if (!waypoints || waypoints.length < 2) {
//       return NextResponse.json(
//         { error: 'At least 2 waypoints are required for optimization' },
//         { status: 400 }
//       );
//     }

//     // Mapbox Optimization API has a limit of 12 coordinates (including start/end)
//     if (waypoints.length > 12) {
//       return NextResponse.json(
//         { error: 'Maximum of 12 waypoints allowed for optimization' },
//         { status: 400 }
//       );
//     }

//     // Extract the first waypoint to use as both start and end point
//     const startEndPoint = waypoints[0];
    
//     // Format coordinates for the Optimization API
//     // The format is: coordinates for all waypoints (including start/end)
//     const coordinates = waypoints.join(';');
    
//     // Get Mapbox access token from environment variables
//     const accessToken = env.mapBoxAccessToken;
    
//     // Build the Optimization API URL
//     // Using 'mapbox/driving' profile for vehicle routing
//     // Setting source and destination to 'first' to make it a round trip starting and ending at the first point
//     const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?source=first&destination=first&roundtrip=true&geometries=geojson&overview=full&steps=true&access_token=${accessToken}`;
    
//     console.log('Fetching Mapbox optimized route with waypoints:', waypoints.length);
//     const res = await fetch(url);
    
//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error('Mapbox Optimization API error:', errorText);
//       return NextResponse.json(
//         { error: `Mapbox API error: ${res.status} ${res.statusText}` },
//         { status: res.status }
//       );
//     }

//     const data = await res.json();
    
//     // Transform the response to match the format of the regular route API
//     // The Optimization API returns a different format than the Directions API
//     const transformedResponse = {
//       routes: data.trips.map((trip: any) => ({
//         geometry: trip.geometry,
//         legs: trip.legs,
//         distance: trip.distance,
//         duration: trip.duration,
//         weight: trip.weight,
//         weight_name: trip.weight_name
//       })),
//       waypoints: data.waypoints.map((waypoint: any) => ({
//         location: waypoint.location,
//         name: waypoint.name,
//         waypoint_index: waypoint.waypoint_index,
//         trips_index: waypoint.trips_index
//       }))
//     };
    
//     return NextResponse.json(transformedResponse);
//   } catch (error) {
//     console.error('Error fetching Mapbox optimized route:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch optimized route from Mapbox API' },
//       { status: 500 }
//     );
//   }
// }


export async function GET(request: Request) {
  return NextResponse.json({
    error: 'Not implemented'
  }, { status: 501 });
}