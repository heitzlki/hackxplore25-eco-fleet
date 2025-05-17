'use client';

import ChatWindow from '@/app/(dashboard)/dashboard/_components/chat-window';
import InfoWindow from '@/app/(dashboard)/dashboard/_components/info-window';

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
