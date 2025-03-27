import { useEffect, useRef } from 'react';
import { Id } from '../../convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface VideoBackgroundProps {
  storageId: Id<'_storage'>;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ storageId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = useQuery(api.videos.getVideoUrl, { storageId });

  useEffect(() => {
    // Force video play on mount
    const playVideo = async () => {
      try {
        if (videoRef.current) {
          await videoRef.current.play();
        }
      } catch (error) {
        console.error('Error playing video:', error);
      }
    };
    
    if (videoUrl) {
      playVideo();
    }
  }, [videoUrl]);

  if (!videoUrl) {
    return null;
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-[1]" />
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
        onError={(e) => console.error('Video error:', e)}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground; 