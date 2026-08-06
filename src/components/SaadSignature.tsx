import React from 'react';

interface SaadSignatureProps {
  className?: string;
}

export const SaadSignature: React.FC<SaadSignatureProps> = ({ className = "h-12 w-auto" }) => {
  return (
    <svg
      viewBox="0 0 500 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]`}
    >
      {/* Cursive 'S' sweeping flourish */}
      <path
        d="M 120,40 C 200,10 260,20 230,60 C 200,100 60,110 30,150 C 10,180 80,190 200,150 C 300,120 450,80 480,115"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />
      {/* 'a' loop */}
      <path
        d="M 190,110 C 180,95 205,90 215,105 C 220,115 210,125 195,120 C 185,115 200,100 225,110"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />
      {/* second 'a' loop */}
      <path
        d="M 235,110 C 225,95 250,90 260,105 C 265,115 255,125 240,120 C 230,115 245,100 270,110"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />
      {/* 'd' stem & loop */}
      <path
        d="M 280,110 C 270,95 295,90 305,105 C 310,115 300,125 285,120 C 290,100 300,30 302,25 C 302,20 298,105 315,115 C 340,120 400,118 470,118"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />
    </svg>
  );
};
