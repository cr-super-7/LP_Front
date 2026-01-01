"use client";

import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function Hero() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <section className="relative flex min-h-[700px] items-center justify-between  py-20 overflow-x-hidden px-26">

      {/* Left side - Text content */}
      <div className="relative z-10 flex flex-col gap-6 max-w-2xl">
        <p className={`text-2xl font-medium animate-fade-in-left animate-delay-100 ${theme === "dark" ? "text-white" : "text-blue-950"}`}>{t("hero.welcome")}</p>
        <h1 className="text-7xl font-bold leading-tight">
          <span className={`animate-fade-in-left animate-delay-200 ${theme === "dark" ? "text-blue-400" : "text-blue-600"} drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] [text-shadow:2px_2px_4px_rgba(255,255,255,0.3)]`}>
            LP
          </span>{" "}
          <span className={`animate-fade-in-left animate-delay-300 ${theme === "dark" ? "text-white" : "text-blue-950"}`}>{t("hero.company")}</span>
        </h1>
        <p className={`text-xl font-light animate-fade-in-left animate-delay-400 ${theme === "dark" ? "text-white/90" : "text-gray-700"}`}>
          {t("hero.tagline")}
        </p>
      </div>

      {/* Right side - Three student images with yellow ring */}
      <div className="relative z-10 flex items-center overflow-visible">
        {/* Yellow ring in the background */}
        <div className="absolute -right-16 -top-12 w-[500px] h-[500px] pointer-events-none z-0 animate-scale-in animate-delay-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="477" height="477" viewBox="0 0 477 477" fill="none" className="animate-rotate-ring">
            <ellipse cx="238.119" cy="237.118" rx="230.555" ry="230.556" fill="url(#paint0_linear_2440_36281)"/>
            <g filter="url(#filter0_d_2440_36281)">
            <ellipse cx="238.119" cy="237.119" rx="197.619" ry="197.619" fill={theme === "dark" ? "#183690" : "#fff"}/>
            <path d="M238.119 40C346.985 40.0002 435.237 128.253 435.237 237.119C435.237 345.985 346.985 434.238 238.119 434.238C129.253 434.238 41 345.985 41 237.119C41 128.253 129.253 40 238.119 40Z" stroke="#183690"/>
            <path d="M238.119 40C346.985 40.0002 435.237 128.253 435.237 237.119C435.237 345.985 346.985 434.238 238.119 434.238C129.253 434.238 41 345.985 41 237.119C41 128.253 129.253 40 238.119 40Z" stroke="url(#paint2_linear_2440_36281)" strokeOpacity="0.2"/>
            </g>
            <defs>
              <filter id="filter0_d_2440_36281" x="0" y="0" width="476.238" height="476.234" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feMorphology radius="0.5" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_2440_36281"/>
              <feOffset dy="1"/>
              <feGaussianBlur stdDeviation="20"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2440_36281"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2440_36281" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_2440_36281" x1="7.56372" y1="237.118" x2="468.674" y2="237.118" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEE400"/>
              <stop offset="1" stopColor={theme === "dark" ? "#47555D" : "#FEE400"}/>
              </linearGradient>
            
            </defs>
          </svg>
        </div>

        {/* Three student images in rounded rectangular frames */}
        <div className="relative flex items-end gap-4 z-10">
          {/* Student 1 - Left (Male with books, green plaid shirt) */}
          <div className="relative w-30 h-64 rounded-2xl overflow-hidden shadow-2xl bg-blue-500 animate-fade-in-right animate-delay-400 hover:scale-105 transition-transform duration-300">     
              <Image
                src="/home/Mask group1.svg"
                alt="Student 1"
                width={176}
                height={256}
                className="w-full h-full object-cover animate-float-image"
                style={{ animationDelay: '0s', width: 'auto', height: 'auto' }}
                priority
              />
           
          </div>

          {/* Student 2 - Center (Female with yellow books, red hoodie) - Largest */}
          <div className="relative w-36 h-80 rounded-2xl overflow-hidden shadow-2xl bg-yellow-400 animate-fade-in-right animate-delay-500 hover:scale-105 transition-transform duration-300">            
              <Image
                src="/home/Mask group2.svg"
                alt="Student 2"
                width={224}
                height={320}
                className="w-full h-full object-cover animate-float-image"
                style={{ animationDelay: '0.2s', width: 'auto', height: 'auto' }}
                priority
              />
            
          </div>

          {/* Student 3 - Right (Male with tablet, orange sweater) */}
          <div className="relative w-36 h-68 rounded-2xl overflow-hidden shadow-2xl bg-teal-400 animate-fade-in-right animate-delay-600 hover:scale-105 transition-transform duration-300">           
              <Image
                src="/home/Mask group3.svg"
                alt="Student 3"
                width={192}
                height={272}
                className="w-full h-full object-cover animate-float-image"
                style={{ animationDelay: '0.4s', width: 'auto', height: 'auto' }}
                priority
              />
            
          </div>
        </div>

      </div>
    </section>
  );
}

