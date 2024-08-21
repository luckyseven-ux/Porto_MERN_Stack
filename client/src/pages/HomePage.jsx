import React, { useEffect } from "react";
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

  useEffect(() => {
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

      {/* Parallax section */}
      <section className="parallax-section">
        <div className="bg" style={{ backgroundImage: `url(${parallax1})` }}></div>
        <h1>Section 1</h1>
      </section>
      <section className="parallax-section">
        <div className="bg" style={{ backgroundImage: `url(${parallax2})` }}></div>
        <h1>Section 2</h1>
      </section>
      <section className="parallax-section">
        <div className="bg" style={{ backgroundImage: `url(${parallax3})` }}></div>
        <h1>Section 3</h1>
      </section>
      <section className="parallax-section">
        <div className="bg" style={{ backgroundImage: `url(${parallax4})` }}></div>
        <h1>Section 4</h1>
      </section>
    </div>
  );
}

export default HomePage;
