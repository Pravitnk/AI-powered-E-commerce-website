import Background from "@/components/Background";
import Hero from "@/components/Hero";
import React, { useEffect, useState } from "react";

const Home = () => {
  let heroData = [
    { text1: "30% OFF limited Period Offer", text2: "Style that" },
    { text1: "Discout the Best of Bold Fashion", text2: "Limited Time Only" },
    { text1: "Explore Our Best Collections", text2: "Shop Now...!" },
    { text1: "Choose your Perfect Fashion Fit", text2: "Now on Sale" },
  ];

  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setHeroCount((prev) => (prev === 3 ? 0 : prev + 1));
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="w-full flex flex-col lg:flex-row">
      {/* Left side - Hero */}
      <div className="w-full lg:w-[40%] flex flex-col justify-between py-10 px-6 md:px-10 lg:px-12 relative z-10">
        <div className="mt-10 md:mt-20">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug">
            {heroData[heroCount].text1}
          </h1>
          <p className="text-lg md:text-xl mt-4 text-gray-300">
            {heroData[heroCount].text2}
          </p>
        </div>

        {/* Dot Indicators */}
        <div className="flex gap-4 mt-10 lg:mt-0 items-center">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
                heroCount === idx ? "bg-yellow-400 scale-110" : "bg-gray-500"
              }`}
              onClick={() => setHeroCount(idx)}
            ></div>
          ))}
        </div>
      </div>

      {/* Right side - Background */}
      <div className="w-full lg:w-[60%] h-[300px] lg:h-auto relative">
        <Background heroCount={heroCount} />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </section>
  );
};

export default Home;
