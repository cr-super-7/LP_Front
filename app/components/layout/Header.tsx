"use client";

import { useEffect, useState } from "react";
import LanguageSelector from "../home/LanguageSelector";
import ThemeToggle from "../home/ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 transition-all duration-300 ${
        isScrolled
          ? theme === "dark"
            ? "bg-blue-950/85 backdrop-blur-md shadow-lg"
            : "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
        <span className="tracking-tight">LB</span>
      </div>

      {/* Right side - Language selector and Theme toggle */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LanguageSelector />
      </div>
    </header>
  );
}

