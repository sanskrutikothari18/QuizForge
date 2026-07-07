import React from 'react';

export default function Logo({ className = 'h-10 w-10', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        {/* Define the mask to create a clean gap around the red circle */}
        <mask id="logo-red-dot-mask">
          {/* Everything white is visible */}
          <rect x="0" y="0" width="100" height="100" fill="white" />
          {/* Black circle cuts a hole of radius 12 around the red dot center */}
          <circle cx="42" cy="35" r="12" fill="black" />
        </mask>
      </defs>

      {/* L-Shaped Corners */}
      {/* Top-Left: Purple */}
      <path
        d="M 44 8 H 8 V 44"
        stroke="#8E59D5"
        strokeWidth="8"
        strokeLinecap="square"
        strokeLinejoin="round"
      />

      {/* Top-Right: Green */}
      <path
        d="M 56 8 H 92 V 44"
        stroke="#1B873F"
        strokeWidth="8"
        strokeLinecap="square"
        strokeLinejoin="round"
      />

      {/* Bottom-Left: Blue */}
      <path
        d="M 8 56 V 92 H 44"
        stroke="#29A6E0"
        strokeWidth="8"
        strokeLinecap="square"
        strokeLinejoin="round"
      />

      {/* Bottom-Right: Pink */}
      <path
        d="M 92 56 V 92 H 56"
        stroke="#E8426E"
        strokeWidth="8"
        strokeLinecap="square"
        strokeLinejoin="round"
      />

      {/* Masked central elements (Orange Pill & Green Shape) */}
      <g mask="url(#logo-red-dot-mask)">
        {/* Orange Pill */}
        <rect x="50" y="29" width="24" height="12" rx="6" fill="#F58220" />

        {/* Green F-Stem & Arm */}
        <path
          d="M 42 82 V 45 H 70 L 74 51 L 70 57 H 58 V 82 A 8 8 0 0 1 42 82 Z"
          fill="#1B873F"
        />
      </g>

      {/* Red Dot (outside mask to remain fully visible) */}
      <circle cx="42" cy="35" r="8.5" fill="#E52424" />
    </svg>
  );
}
