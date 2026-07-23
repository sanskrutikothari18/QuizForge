import React from 'react';
import { User } from 'lucide-react';

const avatarMap = {
  'dog': '/avatars/dog.svg',
  'cat': '/avatars/cat.svg',
  'mouse': '/avatars/mouse.svg',
  'hamster': '/avatars/hamster.svg',
  'rabbit': '/avatars/rabbit.svg',
  'fox': '/avatars/fox.svg',
  'bear': '/avatars/bear.svg',
  'panda': '/avatars/panda.svg',
  'koala': '/avatars/koala.svg',
  'tiger': '/avatars/tiger.svg',
  'lion': '/avatars/lion.svg',
  'cow': '/avatars/cow.svg',
  // Backward compatibility for database entries containing raw emojis
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
  
  // Clean fallback using a Lucide User icon instead of the raw text silhouette emoji
  return <User className={`inline-block text-gray-400 ${className}`} />;
};

export default Avatar;
