import MapView from './map-view';

import * as React from 'react';

import MainStats from './main-stats';

export default function Map() {
  return (
    <div className='relative h-screen w-screen'>
      <MapView />
      <MainStats />
    </div>
  );
}
