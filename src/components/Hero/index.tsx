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
      width={300}
      height={300}
      cx={150}
      cy={150}
      rx={98}
      ry={98}
      reversed={true}
      text="* STRENGTH * LEADERSHIP * AMBITION * GROWTH * ASCENSION *"
      textProps={{
        style: {
          fontSize: 10,
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          letterSpacing: 3.5,
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
    <div className="flex w-full max-w-content self-center font-poppins flex-wrap justify-center gap-8 lg:gap-0 lg:justify-between md:px-20 px-6 py-12">
      {/* Animated circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex lg:min-w-full"
      >
        <div className="relative justify-center lg:-ml-8 items-center flex">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <CircleTextV />
          </motion.div>
          <div className="w-10 h-10 bg-green-app rounded-full absolute" />
        </div>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex-col w-[300px] self-end"
      >
        <div className="flex gap-2 items-center uppercase text-xs tracking-widest font-semibold text-foreground/50 mb-3">
          <p>{t("hero.greeting")}</p>
          <div className="w-16 h-px bg-foreground/30" />
        </div>
        <p className="text-6xl sm:text-7xl font-bold leading-none">
          <span>{t("hero.tagline1")}</span>{" "}
          <span className="text-green-app">{t("hero.tagline2")}</span>
        </p>
      </motion.div>

      {/* Photo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-[400px] w-full max-w-[320px] flex flex-col"
      >
        <div className="w-[75%] sm:w-[240px] h-[290px] bg-white sm:ml-[70px] sm:-mb-[45%] self-end z-20 relative justify-center items-center flex">
          <Image
            src="/images/me.jpg"
            alt="Seba Gedeon"
            width={500}
            height={500}
            className="border-background border-6 w-[72%] aspect-square rounded-full object-cover"
          />
        </div>
        <div className="w-[75%] max-w-[240px] sm:w-[240px] h-[260px] bg-accent self-start sm:mt-0 -mt-[160px] relative z-0" />
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-md flex flex-col gap-6 lg:-mr-8"
      >
        <h2 className="text-2xl font-bold">{t("hero.name")}</h2>
        <p className="text-sm text-foreground/65 leading-relaxed max-w-sm">
          {t("hero.description")}
        </p>
        <Link
          href="/about"
          className="font-semibold text-sm flex items-center gap-2 group w-fit"
        >
          <span>{t("hero.learnMore")}</span>
          <Arrow />
        </Link>
      </motion.div>
    </div>
  );
}

export default Hero;
