import React from 'react';
import Image from 'next/image';

const BackgroundImage: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-[1]" />
      <Image
        src="/calAcademypic.jpg"
        alt="California Academy background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
    </div>
  );
};

export default BackgroundImage; 