'use server'

export const environment = async () => {
  return {
    mapBoxAccessToken: process.env.MAP_BOX_ACCESS_TOKEN
  }
}