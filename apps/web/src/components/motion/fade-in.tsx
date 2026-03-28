"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 24,
  className,
  once = true,
}: FadeInProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Before hydration or with reduced motion: render children directly
  if (!mounted || reduced) {
    return <div className={className}>{children}</div>;
  }

  const dirMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...dirMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className={className}
    >
      {children as React.ReactNode}
    </motion.div>
  );
}
