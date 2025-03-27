import React from 'react';

const BackgroundImage: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-[1]" />
      <img
        src="/nature-background.gif"
        alt="Nature background"
        className="w-full h-full object-cover"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
      />
    </div>
  );
};

export default BackgroundImage; 