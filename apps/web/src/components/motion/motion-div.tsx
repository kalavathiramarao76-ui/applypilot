"use client";
import React from "react";
import { motion, type MotionProps } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type AnimProps = Pick<MotionProps, "initial" | "animate" | "whileInView" | "whileHover" | "viewport" | "transition">;

interface MotionDivProps extends AnimProps {
  children: ReactNode;
  className?: string;
}

export function MotionDiv({ children, className, ...animProps }: MotionDivProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return <motion.div className={className} {...animProps}>{children as React.ReactNode}</motion.div>;
}

interface MotionLiProps extends AnimProps {
  children: ReactNode;
  className?: string;
}

export function MotionLi({ children, className, ...animProps }: MotionLiProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <li className={className}>{children}</li>;
  }

  return <motion.li className={className} {...animProps}>{children as React.ReactNode}</motion.li>;
}
