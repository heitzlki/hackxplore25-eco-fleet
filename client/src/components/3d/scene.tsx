// 'use client';
// import React from 'react';
// import Scene from '@/components/3d/scene';
// import { Canvas } from '@react-three/fiber';

// const SceneWrap = () => {
//   return (
//     <Canvas style={{ backgroundColor: 'black', height: '100vh' }} shadows>
//       <Scene />
//     </Canvas>
//   );
// };

// export default SceneWrap;

'use client';

import { Viewport } from 'next';

import { Canvas } from '@react-three/fiber';
import { Door } from '@/components/3d/door';
import { DoorTwo } from '@/components/3d/door_two';
import { CameraControls, OrbitControls } from '@react-three/drei';

export default function Scene() {
  return (
    <div className='z-[-10] top-0 w-full h-screen'>
      <Canvas dpr={[1, 2]} camera={{ fov: 100 }}>
        {/* <axesHelper args={[5]} /> */}
        {/* <CameraControls makeDefault /> */}
        <OrbitControls autoRotate autoRotateSpeed={-3} />
        <ambientLight intensity={1} />
        <Door />
        {/* <DoorTwo /> */}
        <directionalLight position={[0, 0, 5]} color='white' />
      </Canvas>
    </div>
  );
}
