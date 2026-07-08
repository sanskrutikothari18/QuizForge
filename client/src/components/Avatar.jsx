import React from 'react';

const avatarMap = {
  '🐶': '/avatars/dog.svg',
  '🐱': '/avatars/cat.svg',
  '🐭': '/avatars/mouse.svg',
  '🐹': '/avatars/hamster.svg',
  '🐰': '/avatars/rabbit.svg',
  '🦊': '/avatars/fox.svg',
  '🐻': '/avatars/bear.svg',
  '🐼': '/avatars/panda.svg',
  '🐨': '/avatars/koala.svg',
  '🐯': '/avatars/tiger.svg',
  '🦁': '/avatars/lion.svg',
  '🐮': '/avatars/cow.svg',
};

const Avatar = ({ emoji, className = "" }) => {
  const src = avatarMap[emoji];
  
  if (src) {
    return <img src={src} alt={emoji} className={`inline-block object-contain ${className}`} />;
  }
  
  // Fallback to text emoji if not found in map
  return <span className={className}>{emoji}</span>;
};

export default Avatar;
