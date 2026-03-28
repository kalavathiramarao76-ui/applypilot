// @ts-nocheck
"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function SmartNavbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = lastY.current;
    if (latest > prev && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
    lastY.current = latest;
  });

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
            >
              <Image src="/logo-icon.svg" alt="Zypply" width={32} height={32} />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              Zypply
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Features", href: "#features" },
              { label: "How it Works", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
              { label: "Blog", href: "#" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-[1px] w-full origin-left scale-x-0 bg-zinc-900 dark:bg-zinc-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
              <Link href="/login">Sign In</Link>
            </Button>
            <motion.div whileHover={{ y: -1, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} transition={{ duration: 0.2 }}>
              <Button asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
