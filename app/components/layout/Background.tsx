"use client";

import { useTheme } from "../../contexts/ThemeContext";

export default function Background() {
  const { theme } = useTheme();
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ width: '100vw', maxWidth: '100%' }}>
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        style={{ maxWidth: '100%', overflow: 'hidden' }}
      >
        {/* Glow filter definition */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="12" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Top glowing circle - animated */}
        <g className="animate-float-top">
          <circle
            cx="300"
            cy="150"
            r="120"
            fill="white"
            opacity="0.5"
            filter="url(#glow-strong)"
          />
         
         
        </g>

        {/* Bottom glowing circle - animated */}
        <g className="animate-float-bottom">
          <circle
            cx="1600"
            cy="950"
            r="120"
            fill="white"
            opacity="0.5"
            filter="url(#glow-strong)"
          />
         
        </g>

        {/* Top left wavy lines - near the top circle */}
        <svg className="absolute" style={{ width: '100%', height: '100%', maxWidth: '100%' }} viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice">
          <path
            d="
              M -50 350
              Q 200 200, 450 260
              Q 700 330, 900 180
              Q 1050 50, 1200 0
            "
            stroke={theme === "dark" ? "#7DD3FC" : "#3B82F6"}
            strokeWidth="1.2"
            fill="none"
            opacity="0.7"
          />


          <path
            d="
              M -50 380
              Q 200 230, 450 290
              Q 700 360, 900 210
              Q 1050 80, 1200 30
            "
            stroke={theme === "dark" ? "#7DD3FC" : "#3B82F6"}
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
          />

          <path
            d="
              M -50 410
              Q 200 260, 450 320
              Q 700 390, 900 240
              Q 1050 110, 1200 60
            "
            stroke={theme === "dark" ? "#7DD3FC" : "#3B82F6"}
            strokeWidth="1.2"
            fill="none"
            opacity="0.3"
          />
        </svg>

        {/* Bottom right wavy lines - near the bottom circle */}
        <svg className="absolute" style={{ width: '100%', height: '100%', maxWidth: '100%' }} viewBox="10 0 1000 800" preserveAspectRatio="xMidYMid slice"> 
          <path
            d="
              M 1250 750
              Q 1050 600, 900 650
              Q 700 720, 500 580
              Q 350 480, 200 500
            "
            stroke={theme === "dark" ? "#7DD3FC" : "#3B82F6"}
            strokeWidth="1.2"
            fill="none"
            opacity="0.7"
          />

          <path
            d="
              M 1250 720
              Q 1050 570, 900 620
              Q 700 690, 500 550
              Q 350 450, 200 470
            "
            stroke={theme === "dark" ? "#7DD3FC" : "#3B82F6"}
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
          />

          <path
            d="
              M 1250 690
              Q 1050 540, 900 590
              Q 700 660, 500 520
              Q 350 420, 200 440
            "
            stroke={theme === "dark" ? "#7DD3FC" : "#3B82F6"}
            strokeWidth="1.2"
            fill="none"
            opacity="0.3"
          />
        </svg>


      </svg>
    </div>
  );
}

