import { NextResponse } from 'next/server';

// Mock database
const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

// export const GET = async (request: Request) => {
//   try {
//     const { searchParams } = new URL(request.url);
//     const role = searchParams.get('role');
    
//     // Filter users by role if provided
//     if (role) {
//       const filteredUsers = users.filter(user => user.role === role);
//       return NextResponse.json(filteredUsers, { status: 200 });
//     }
    
//     return NextResponse.json(users, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// };

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    let waypointsParam = searchParams.get('waypoints');
    let waypoints = waypointsParam ? waypointsParam.split(',') : [];
  
    if (!waypoints || waypoints.length < 2) {
    //   return new Response('Missing start or end coordinates', { status: 400 });
        // start = "8.403645%2C49.006882"
        // end = "8.403645%2C49.006882"
        waypoints = [
            "8.403645%2C49.006882",
            "8.403645%2C49.006882"
        ];
    }
  
    try {
    //   const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&overview=full&access_token=${process.env.MAP_BOX_ACCESS_TOKEN}`;
    const coordinates = waypoints.join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&overview=full&access_token=${process.env.MAP_BOX_ACCESS_TOKEN}`;
      
      console.log('Fetching Mapbox route:', url);
      const res = await fetch(url);

      
      if (!res.ok) {
        const errorText = await res.text();
        return new Response(errorText, { status: res.status });
      }
  
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error fetching Mapbox route:', error);
      return new Response('Error fetching route', { status: 500 });
    }
  } 