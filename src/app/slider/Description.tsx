import React from "react";
import { images } from "./constants";
import { motion } from "framer-motion";

type Props = {
  activeImage: any;
  clickNext: any;
  clickPrev: any;
};

const Description = ({ activeImage, clickNext, clickPrev }: Props) => {
  return (
    <div className="grid place-items-start w-full bg-[#f6f6f6] relative md:rounded-tr-3xl md:rounded-br-3xl">
      <div className="uppercase text-sm absolute right-4 top-2 underline-offset-4 underline">
      </div>
      {images.map((elem, idx) => (
        <div
          key={idx}
          className={`${idx === activeImage
            ? "block w-full h-[30vh] text-left"
            : "hidden"
            }`}
        >
          <motion.div
            // initial={{
            //   opacity: idx === activeImage ? 0 : 0.5,
            //   scale: idx === activeImage ? 0.5 : 0.3,
            // }}
            // animate={{
            //   opacity: idx === activeImage ? 1 : 0.5,
            //   scale: idx === activeImage ? 1 : 0.3,
            // }}
            transition={{
              ease: "linear",
              duration: 2,
              x: { duration: 1 },
            }}
            className="w-full"
          >
            <div className="pt-3 pl-3 pr-3 text-2xl font-extrabold">{elem.title}</div>
            <div className="leading-relaxed font-medium text-base tracking-wide pl-3 p-3 h-60 md:h-40 italic text-gray-600">
              {elem.desc}
            </div>
          </motion.div>

          <button className="bg-black p-2 ml-4 text-white uppercase rounded-md ">
            Buy now
          </button>
          <div className="absolute md:bottom-1 bottom-5 right-10 md:right-0 w-full flex justify-center items-center">
            <div
              className="absolute bottom-2 ml-2 mr-2 right-10 cursor-pointer"
              onClick={clickPrev}
            >
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13" />
              </svg>
            </div>
            <div
              className="absolute bottom-2 right-2 cursor-pointer"
              onClick={clickNext}
            >
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Description;
