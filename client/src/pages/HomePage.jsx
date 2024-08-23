import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../component/Navbar";
import Carousel from "../component/Carousel";
import { useTheme } from "../global/ThemeContext";
import banner1 from "../img/banner1.svg";
import banner2 from "../img/banner2.svg";
import banner3 from "../img/banner3.svg";
import parallax1 from "../img/parallax1.jpg";
import parallax2 from "../img/parallax2.jpg";
import parallax3 from "../img/parallax3.jpg";
import parallax4 from "../img/parallax4.jpg";

gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const { darkMode } = useTheme();
  const images = [banner1, banner2, banner3];
  const [currentindex, setCurrentindex] = useState("");
  const [writer, setWriter] = useState(false);
  const [done, setdone] = useState(0);
  const texts = [
    "Welcome To Our Website",
    "Build Faster, Scale Further",
    "Innovate with Us",
  ];
  useEffect(() => {//ini useeffect untuk typing text
    // Set initial state
    let current = 0;
    const text =
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur ";
    const totalDuration = 4000;
    // Calculate interval speed based on the text length and total duration
    const intervalSpeed = totalDuration / text.length;
    const typing = setInterval(() => {
      setWriter((prev) => prev + text[current]);
      current++;
      if (current === text.length) {
        clearInterval(typing);
        setdone(true)
      }
    }, intervalSpeed);
    return () => clearInterval(typing);
  }, [currentindex]);

  useEffect(()=>{
    if(done){
      const out=setTimeout(()=>{
        setdone(false)
        setWriter("")
        setCurrentindex((prev)=>(prev+1)% texts.length)


        
      },5000)
      return () => clearTimeout(out)
    }
  },[done,texts.length])

  useEffect(() => {//ini useeffect untuk parallax
    const sections = document.querySelectorAll("section.parallax-section");

    sections.forEach((section, i) => {
      const bg = section.querySelector(".bg");

      gsap.to(bg, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-slate-200 text-gray-900"
      }`}
    >
      <Navbar />
      <Carousel images={images} />
      <div className="flex flex-col items-center justify-center pt-8 mt-20">
        <h1 className="text-5xl font-bold">Welcome To Our Website</h1>
        <p className="mt-4 text-lg">Please login for access to other menus.</p>
      </div>

      {/* Bagian text yang menggunakan flexbox */}
      <div className="flex justify-between items-center text-center py-12 mt-24">
        <div className="flex flex-col items-center w-1/3 px-4">
          <img src="path_to_icon1.png" alt="Icon 1" className="mb-4" />
          <h1 className="text-2xl font-bold">Build Faster</h1>
          <p className="text-gray-700 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            mollitia, molestiae quas vel sint commodi repudiandae consequuntur
            voluptatum laborum numquam blanditiis harum quisquam eius sed odit
            fugiat iusto fuga praesentium optio, eaque rerum!
          </p>
        </div>

        <div className="flex flex-col items-center w-1/3 px-4">
          <img src="path_to_icon2.png" alt="Icon 2" className="mb-4" />
          <h1 className="text-2xl font-bold">Scale Further</h1>
          <p className="text-gray-700 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            mollitia, molestiae quas vel sint commodi repudiandae consequuntur
            voluptatum laborum numquam blanditiis harum quisquam eius sed odit
            fugiat iusto fuga praesentium optio, eaque rerum!
          </p>
        </div>

        <div className="flex flex-col items-center w-1/3 px-4">
          <img src="path_to_icon3.png" alt="Icon 3" className="mb-4" />
          <h1 className="text-2xl font-bold">Sleep Better</h1>
          <p className="text-gray-700 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            mollitia, molestiae quas vel sint commodi repudiandae consequuntur
            voluptatum laborum numquam blanditiis harum quisquam eius sed odit
            fugiat iusto fuga praesentium optio, eaque rerum!
          </p>
        </div>
      </div>
      {/* End of text flexbox */}

      <div className="flex justify-center items-center mt-12">
        <h1 className="text-2xl font-bold text-center w-1/2 mb-20">{writer}</h1>
      </div>

      {/* Parallax section */}
      <section className="relative h-screen overflow-hidden parallax-section">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed bg-opacity-70"
          style={{ backgroundImage: `url(${parallax1})` }}
        ></div>
        <h1 className="relative z-10 text-white text-4xl font-bold text-center pt-40">
          See The Transition
        </h1>
      </section>
      <section className="relative h-screen overflow-hidden parallax-section">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed bg-opacity-70"
          style={{ backgroundImage: `url(${parallax2})` }}
        ></div>
        <h1 className="relative z-10 text-white text-4xl font-bold text-center pt-40">
          So Smooth Right
        </h1>
      </section>
      <section className="relative h-screen overflow-hidden parallax-section">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed bg-opacity-70"
          style={{ backgroundImage: `url(${parallax3})` }}
        ></div>
        <h1 className="relative z-10 text-white text-4xl font-bold text-center pt-40">
          Why Steal Scrolling
        </h1>
      </section>
      <section className="relative h-screen overflow-hidden parallax-section">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed bg-opacity-70"
          style={{ backgroundImage: `url(${parallax4})` }}
        ></div>
        <h1 className="relative z-10 text-white text-4xl font-bold text-center pt-40">
          Are U Amazed With It
        </h1>
      </section>
    </div>
  );
}

export default HomePage;
