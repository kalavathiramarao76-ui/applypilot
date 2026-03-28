"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function TextReveal({ text, className, delay = 0, staggerDelay = 0.08 }: TextRevealProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // SSR + before hydration: render plain text
  if (!mounted || reduced) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <motion.span initial="hidden" whileInView="visible" viewport={{ once: true }} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "100%", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.6, delay: delay + i * staggerDelay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
              },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </motion.span>
  );
}
