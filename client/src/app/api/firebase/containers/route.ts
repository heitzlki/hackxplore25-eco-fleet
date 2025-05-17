'use server';

import { NextResponse } from 'next/server';
import { environment } from '@/lib/environment';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCOVyqWUsM8kZRDIewyDdCYL2kvXauLDQI",
  authDomain: "hackxplore-3deb8.firebaseapp.com",
  databaseURL: "https://hackxplore-3deb8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hackxplore-3deb8",
  storageBucket: "hackxplore-3deb8.firebasestorage.app",
  messagingSenderId: "505386861890",
  appId: "1:505386861890:web:28109a0e9098245e3474db",
  measurementId: "G-3ZD86YEMB5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

/**
 * GET handler for container data
 * Fetches container data from Firebase Realtime Database
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const containerId = searchParams.get('id');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    const env = await environment();
    const db = getDatabase(app, env.firebaseRealtimeDbUrl);
    
    // Determine path based on whether an ID is provided
    const containerPath = containerId ? `containers/${containerId}` : 'containers';
    const containersRef = ref(db, containerPath);

    console.log(`Fetching container data from Firebase: ${containerPath}`);
    
    const snapshot = await get(containersRef);
    
    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: 'No container data found' },
        { status: 404 }
      );
    }
    
    let containerData = snapshot.val();
    
    // If we have a limit and the data is an array (or can be converted to one)
    if (limit && !containerId && typeof containerData === 'object') {
      // Convert to array if it's not already
      const containerArray = Array.isArray(containerData) 
        ? containerData 
        : Object.values(containerData);
      
      // Apply limit
      containerData = containerArray.slice(0, limit);
    }
    
    // Add index property to each container for identification
    if (Array.isArray(containerData)) {
      containerData = containerData.map((container, index) => ({
        ...container,
        index
      }));
    }
    
    return NextResponse.json(containerData);
  } catch (error) {
    console.error('Error fetching container data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch container data from Firebase' },
      { status: 500 }
    );
  }
}