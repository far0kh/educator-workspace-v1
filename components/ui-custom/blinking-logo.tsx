import React from 'react';

interface BlinkingLogoProps {
  mainClass?: string;
  imgClass?: string;
  spotClass?: string;
  isBlinking?: boolean;
}

const BlinkingLogo: React.FC<BlinkingLogoProps> = ({ mainClass, imgClass, spotClass, isBlinking }) => {
  return (
    <div className={`relative inline-block ${mainClass}`}>
      <img src="/logo.webp" alt="Logo" className={`max-w-full ${imgClass}`} />
      <div className={`absolute rounded-full ${isBlinking && 'animate-ping'} ${spotClass}`}></div>
    </div>
  );
};

export default BlinkingLogo;