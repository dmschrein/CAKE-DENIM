"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function VideoWithFallback() {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="w-full flex justify-center mt-6">
      {videoError ? (
        // Fallback Image
        <Image
          src="/assets/CD-Website-2.png"
          alt="Fallback image"
          width={1920}
          height={1080}
          className="w-full md:w-2/3 lg:w-full"
        />
      ) : (
        // Autoplay Video
        <video
          className="w-full md:w-2/3 lg:w-full"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/CD-Website-2.png" // Optional fallback before the video starts
          onError={() => setVideoError(true)} // Fallback to image if video fails to load
        >
          <source src="/assets/website-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
