import React from "react";

function Preloader() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">

      {/* Logo */}
      <img
        src="/dosth_logo.png" // 👉 place your logo in public folder
        alt="Dosth Caterings Logo"
        className="w-28 h-28 mb-6 animate-pulse"
      />

      {/* App Name */}
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 tracking-wide">
        Dosth Caterings
      </h1>

      {/* Loader */}
      <div className="flex flex-col items-center gap-2">
        <img
          src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-15-221_512.gif"
          alt="Loading..."
          className="w-16 h-16"
        />
        <p className="text-gray-500 text-sm animate-pulse">
          Preparing your experience...
        </p>
      </div>

    </div>
  );
}

export default Preloader;