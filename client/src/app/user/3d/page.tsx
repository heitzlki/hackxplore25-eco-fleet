'use client';

import ChatWindow from '@/app/user/_components/chat-window';
import InfoWindow from '@/app/user/_components/info-window';

import Scene from '@/components/3d/scene';

export default function Chat() {
  return (
    <div suppressHydrationWarning>
      <Scene />

      <ChatWindow />

      <InfoWindow />
    </div>
  );
}
