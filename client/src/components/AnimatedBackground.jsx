import React from 'react';
import { motion } from 'framer-motion';
import './animated-bg.css';

const Blob = ({ color, size, style, delay = 0 }) => (
  <motion.div
    className="blob"
    style={{ background: color, width: size, height: size, ...style }}
    initial={{ y: 0, x: 0, scale: 1 }}
    animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.02, 1] }}
    transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay }}
  />
);

export default function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden>
      <Blob color="rgba(255,99,132,0.12)" size={220} style={{ left: '8%', top: '8%' }} delay={0} />
      <Blob color="rgba(59,130,246,0.10)" size={260} style={{ right: '6%', top: '18%' }} delay={1} />
      <Blob color="rgba(16,185,129,0.10)" size={200} style={{ left: '12%', bottom: '6%' }} delay={2} />
      <Blob color="rgba(251,191,36,0.10)" size={240} style={{ right: '14%', bottom: '12%' }} delay={0.5} />
    </div>
  );
}
