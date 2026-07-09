import React from 'react';

export default function Logo({ className = 'h-10 w-10', style = {}, ...props }) {
  return (
    <img
      src="/fourise-logo.png"
      alt="Fourise Logo"
      className={className}
      style={{ objectFit: 'contain', ...style }}
      {...props}
    />
  );
}
