"use client"

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

// why is provider created ?
const StreamVideoProvider = ({ children }:{ children: ReactNode}) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  // clerkのカスタムフック clerkのユーザ情報がクライアント側で取得できる
  const { user, isLoaded } = useUser();

  // 副作用 Rendering parseではなく commit parseで作用しているはず
  useEffect(() => {
    if(!isLoaded || !user) return;
    if(!API_KEY) throw new Error("Stream API key missing");

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      tokenProvider
    });

    setVideoClient(client)
  },[user, isLoaded])

  if (!videoClient) return <Loader />;

  return (
    <StreamVideo client={videoClient}>
      { children }
    </StreamVideo>
  );
};

export default StreamVideoProvider