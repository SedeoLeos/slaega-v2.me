"use client";

import React from "react";
import CurvedText from "react-curved-text";
import Arrow from "../icons/arrow";
import Link from "next/link";

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
  return (
    <div className=" flex  w-full max-w-content self-center font-poppins flex-wrap justify-center gap-10 lg:gap-0 lg:justify-between md:px-20 px-10 py-10 ">
      <div className="flex  lg:min-w-full ">
        <div className="relative justify-center lg:-ml-10 items-center flex ">
          <CircleTextV />
          <div className="w-[50px] h-[50px] bg-green-app rounded-full absolute"></div>
        </div>



      </div>

      <div className=" flex-col w-[320px]  self-end  ">
        <div className="flex gap-2 items-center uppercase"> <p>hi there</p>  <div className="w-24 h-1 bg-black"></div></div>
        <p className="text-7xl">
          <span>lets think</span> <span className="text-green-app">creative</span></p>
      </div>

      <div className="h-[434px] w-full max-w-[353px]  flex flex-col ">
        <div className=" w-[80%] sm:w-[271.87px]  h-[328.18px] bg-white  sm:ml-[78px] sm:-mb-[50%] self-end z-20 relative"></div>
        <div className=" w-[80%] max-w-[271.87px]  sm:w-[271.87px]  h-[285.07px] bg-accent  self-start sm:mt-0 sm:ml-0  -mt-[180px] relative z-0"></div>
      </div>

      <div className="w-md flex flex-col gap-8  lg:-mr-10">
        <h2 className="text-3xl font-bold">
          I&apos;m <span>Seba Gedeon</span>
        </h2>
        <p className="">
          A Frontend Developer who excels in shaping seamless user
          experiences. I possess a strong design sensibility, focusing on
          crafting intuitive and visually appealing websites.
        </p>
        <Link href={""} className="font-semibold  flex items-center gap-2"> <span>learn more</span> <Arrow /></Link>
      </div>
      {/* </div> */}
    </div>
  );
}

export default Hero;
