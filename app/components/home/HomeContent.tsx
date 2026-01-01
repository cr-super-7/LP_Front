"use client";

import { useTheme } from "../../contexts/ThemeContext";
import Header from "../layout/Header";
import Background from "../layout/Background";
import Hero from "./Hero";
import EducationalPlatform from "./EducationalPlatform";
import Properties from "./Properties";
import Blogs from "./Blogs";

export default function HomeContent() {
  const { theme } = useTheme();
  
  return (
    <div className={`relative min-h-screen overflow-x-hidden ${
      theme === "dark" 
        ? "bg-linear-to-b from-blue-950 via-blue-900 to-blue-950"
        : "bg-linear-to-b from-white via-gray-50 to-white"
    }`}>
      <Background />
      
      {/* Content with relative positioning */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <EducationalPlatform />
        <Properties />
        <Blogs />
      </div>
    </div>
  );
}

