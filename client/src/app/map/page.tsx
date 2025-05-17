import MapView from './map-view';

import * as React from 'react';

import MainStats from './main-stats';
import ControlCenter from './control-center';

export default function Map() {
  return (
    <div className='relative h-screen w-screen'>
      <MapView />
      <MainStats />
      <ControlCenter />
    </div>
  );
}
