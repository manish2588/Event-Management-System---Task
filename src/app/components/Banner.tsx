"use client";
import React from "react";

const Banner: React.FC = () => {
  return (
    <div className="relative h-[50vh] md:h-[70vh] w-full bg-gray-800 shadow-lg shadow-green-200">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: "url('/images/Banner.jpg')",
        }}
      ></div>
      <div className="absolute bg-black/50 inset-0 flex flex-col justify-center space-y-2 items-center"></div>
    </div>
  );
};

export default Banner;
