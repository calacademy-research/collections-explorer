import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    
    playVideo();
  }, []);

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
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground; 