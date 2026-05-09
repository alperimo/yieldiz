import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const CinematicSpotlight = ({
  className = '',
  reducedMotion = false,
  size = 560,
}) => {
  const containerRef = useRef(null);
  const [parentElement, setParentElement] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useSpring(0, { stiffness: 190, damping: 28, mass: 0.35 });
  const mouseY = useSpring(0, { stiffness: 190, damping: 28, mass: 0.35 });
  const left = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const top = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (parent) setParentElement(parent);
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      if (!parentElement) return;
      const bounds = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - bounds.left);
      mouseY.set(event.clientY - bounds.top);
    },
    [mouseX, mouseY, parentElement],
  );

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  useEffect(() => {
    if (reducedMotion || !parentElement) return undefined;

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', handleEnter);
    parentElement.addEventListener('mouseleave', handleLeave);

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', handleEnter);
      parentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, [handleEnter, handleLeave, handleMouseMove, parentElement, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute z-[2] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.42),rgba(248,230,182,0.26)_32%,rgba(214,168,79,0.12)_54%,transparent_72%)] blur-2xl transition-opacity duration-300 ${className}`}
      style={{ width: size, height: size, left, top, opacity: isHovered ? 1 : 0 }}
    />
  );
};

