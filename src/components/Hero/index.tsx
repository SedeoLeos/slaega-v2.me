"use client";

import React from "react";
import CurvedText from "react-curved-text";
import Arrow from "../icons/arrow";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

function CircleTextV() {
  return (
    <CurvedText
      width={350}
      height={350}
      cx={175}
      cy={175}
      rx={116}
      ry={116}
      reversed={true}
      text="* STRENGHT * LEARDESHIP * AMBITION * ENDURANCE * GROWTH * ASCENSION *"
      textProps={{
        style: {
          fontSize: 12,
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          letterSpacing: 4,
        },
      }}
      textPathProps={null}
      tspanProps={null}
      ellipseProps={null}
    />
  );
}

function Hero() {
  const t = useTranslations();

  return (
    <section className="w-full max-w-content self-center font-poppins px-10 md:px-20 py-16 relative">
      {/* Rig-style floating accent lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        {/* Top-left cluster */}
        <div className="absolute top-6  left-0  w-28 h-0.5 opacity-30" style={{ backgroundColor: 'var(--green-app)' }} />
        <div className="absolute top-10 left-8  w-16 h-0.5 opacity-20" style={{ backgroundColor: 'var(--green-app)' }} />
        <div className="absolute top-16 left-2  w-10 h-0.5 opacity-15" style={{ backgroundColor: 'var(--green-app)' }} />
        {/* Top-right cluster */}
        <div className="absolute top-8  right-0  w-24 h-0.5 opacity-25" style={{ backgroundColor: 'var(--green-app)' }} />
        <div className="absolute top-14 right-6  w-14 h-0.5 opacity-15" style={{ backgroundColor: 'var(--green-app)' }} />
        {/* Mid-left */}
        <div className="absolute top-1/3 left-0  w-20 h-0.5 opacity-10" style={{ backgroundColor: 'var(--green-app)' }} />
        {/* Bottom-left */}
        <div className="absolute bottom-8  left-4  w-32 h-0.5 opacity-20" style={{ backgroundColor: 'var(--green-app)' }} />
        <div className="absolute bottom-14 left-0  w-12 h-0.5 opacity-10" style={{ backgroundColor: 'var(--green-app)' }} />
        {/* Bottom-right */}
        <div className="absolute bottom-6  right-0  w-20 h-0.5 opacity-20" style={{ backgroundColor: 'var(--green-app)' }} />
        <div className="absolute bottom-12 right-8  w-10 h-0.5 opacity-12" style={{ backgroundColor: 'var(--green-app)' }} />
      </div>

      <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-16 items-center">
        {/* Left: rotating circle text + tagline */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-8 items-center lg:items-start"
        >
          {/* Rotating circle */}
          <div className="relative justify-center items-center flex">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <CircleTextV />
            </motion.div>
            <div className="w-[50px] h-[50px] bg-green-app rounded-full absolute" />
          </div>

          {/* Tagline */}
          <div className="flex flex-col gap-3 max-w-sm">
            <div className="flex gap-3 items-center uppercase">
              <p className="text-xs font-semibold tracking-widest text-foreground/60">
                {t("hero.greeting")}
              </p>
              <div className="w-16 h-0.5 bg-foreground" />
            </div>
            <h1 className="text-6xl sm:text-7xl font-extrabold leading-[0.95]">
              <span className="block">{t("hero.tagline1")}</span>
              <span className="block text-green-app">{t("hero.tagline2")}</span>
            </h1>
          </div>
        </motion.div>

        {/* Center: Photo with clean frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative w-[280px] h-[360px] mx-auto"
        >
          {/* Olive accent block (offset) */}
          <div className="absolute -bottom-4 -right-4 w-full h-full bg-accent rounded-3xl z-0" />
          {/* White photo container */}
          <div className="relative w-full h-full bg-white rounded-3xl flex items-center justify-center z-10 overflow-hidden shadow-md">
            <Image
              src="/images/me.jpg"
              alt="Seba Gedeon"
              width={500}
              height={500}
              priority
              className="w-[78%] aspect-square object-cover rounded-full border-8 border-background shadow-sm"
            />
          </div>
        </motion.div>

        {/* Right: Bio */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-col gap-6 max-w-sm mx-auto lg:items-start items-center text-center lg:text-left"
        >
          <h2 className="text-3xl font-extrabold leading-tight">{t("hero.name")}</h2>
          <p className="text-foreground/70 leading-relaxed text-sm">
            {t("hero.description")}
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 font-bold text-foreground hover:gap-3 transition-all"
          >
            <span>{t("hero.learnMore")}</span>
            <Arrow />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
