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
    <div className="flex w-full max-w-content self-center font-poppins flex-wrap justify-center gap-10 lg:gap-0 lg:justify-between md:px-20 px-10 py-10">
      {/* Circle — original size, with slow rotation animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex lg:min-w-full"
      >
        <div className="relative justify-center lg:-ml-10 items-center flex">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <CircleTextV />
          </motion.div>
          <div className="w-[50px] h-[50px] bg-green-app rounded-full absolute" />
        </div>
      </motion.div>

      {/* Tagline — original typography */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="flex-col w-[320px] self-end"
      >
        <div className="flex gap-2 items-center uppercase">
          <p>{t("hero.greeting")}</p>
          <div className="w-24 h-1 bg-black" />
        </div>
        <p className="text-7xl">
          <span>{t("hero.tagline1")}</span>{" "}
          <span className="text-green-app">{t("hero.tagline2")}</span>
        </p>
      </motion.div>

      {/* Photo — original exact dimensions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="h-[434px] w-full max-w-[353px] flex flex-col"
      >
        <div className="w-[80%] sm:w-[271.87px] h-[328.18px] bg-white sm:ml-[78px] sm:-mb-[50%] self-end z-20 relative justify-center items-center flex">
          <Image
            objectFit="cover"
            src="/images/me.jpg"
            alt="Seba Gedeon"
            width={500}
            height={500}
            className="border-background border-8 w-3/4 aspect-square rounded-full"
          />
        </div>
        <div className="w-[80%] max-w-[271.87px] sm:w-[271.87px] h-[285.07px] bg-accent self-start sm:mt-0 sm:ml-0 -mt-[180px] relative z-0" />
      </motion.div>

      {/* Bio — original layout */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="w-md flex flex-col gap-8 lg:-mr-10"
      >
        <h2 className="text-3xl font-bold">{t("hero.name")}</h2>
        <p>{t("hero.description")}</p>
        <Link href="/about" className="font-semibold flex items-center gap-2">
          <span>{t("hero.learnMore")}</span>
          <Arrow />
        </Link>
      </motion.div>
    </div>
  );
}

export default Hero;
