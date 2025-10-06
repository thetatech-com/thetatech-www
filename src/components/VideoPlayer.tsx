import React from 'react';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer = ({ src }: VideoPlayerProps) => {
  return (
    <div>
      <video controls src={src} className="w-full"></video>
    </div>
  );
};

export default VideoPlayer;
