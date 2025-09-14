"use client";

import React from "react";
import CurvedText from "react-curved-text";
import Arrow from "../icons/arrow";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

function CircleTextV() {
  return (
    <CurvedText
      width={350} // largeur du SVG
      height={350} // hauteur du SVG
      cx={175} // centre X
      cy={175} // centre Y
      rx={116} // rayon horizontal
      ry={116} // rayon vertical
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
    <div className=" flex  w-full max-w-content self-center font-poppins flex-wrap justify-center gap-10 lg:gap-0 lg:justify-between md:px-20 px-10 py-10 ">
      <div className="flex  lg:min-w-full ">
        <div className="relative justify-center lg:-ml-10 items-center flex ">
          <CircleTextV />
          <div className="w-[50px] h-[50px] bg-green-app rounded-full absolute"></div>
        </div>



      </div>

      <div className=" flex-col w-[320px]  self-end  ">
        <div className="flex gap-2 items-center uppercase"> <p>{t('hero.greeting')}</p>  <div className="w-24 h-1 bg-black"></div></div>
        <p className="text-7xl">
          <span>{t('hero.tagline1')}</span> <span className="text-green-app">{t('hero.tagline2')}</span></p>
      </div>

      <div className="h-[434px] w-full max-w-[353px]  flex flex-col ">
        <div className=" w-[80%] sm:w-[271.87px]  h-[328.18px] bg-white  sm:ml-[78px] sm:-mb-[50%] self-end z-20 relative justify-center items-center flex">
          <Image objectFit="cover" src={'/images/me.jpg'} alt={'me'} width={500} height={500} className="border-background border-8 w-3/4 aspect-square rounded-full"  />

        </div>
        <div className=" w-[80%] max-w-[271.87px]  sm:w-[271.87px]  h-[285.07px] bg-accent  self-start sm:mt-0 sm:ml-0  -mt-[180px] relative z-0"></div>
      </div>

      <div className="w-md flex flex-col gap-8  lg:-mr-10">
        <h2 className="text-3xl font-bold">
          {t('hero.name')}
        </h2>
        <p className="">
          {t('hero.description')}
        </p>
        <Link href={""} className="font-semibold  flex items-center gap-2"> <span>{t('hero.learnMore')}</span> <Arrow /></Link>
      </div>
      {/* </div> */}
    </div>
  );
}

export default Hero;
