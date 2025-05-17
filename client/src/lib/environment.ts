'use server'

export const environment = async () => {
  return {
    mapBoxAccessToken: process.env.MAP_BOX_ACCESS_TOKEN,
    firebaseRealtimeDbUrl: 'https://hackxplore-3deb8-default-rtdb.europe-west1.firebasedatabase.app'
  }
}