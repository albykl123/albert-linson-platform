import React from "react";

export function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-electric-500/15 via-violet-500/10 to-transparent blur-3xl rounded-full" />
    </div>
  );
}
