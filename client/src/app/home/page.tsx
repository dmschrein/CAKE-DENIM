"use client";

import Image from "next/image";

//import { pricingCards } from "@/lib/constants";

import VideoWithFallback from "@/components/common/Video";
import PopupModal from "@/components/forms/PopupModal";

export default function Home() {
  return (
    <>
      {/* Hero section*/}
      <section className="h-full w-full relative flex items-center justify-center flex-col">
        {/* grid */}
        {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" /> */}
        <PopupModal />
        <Image
          src={"/assets/CD-hero.png"}
          width={1920}
          height={1080}
          alt="plur logo"
        />
        <ul className="h-full w-full grid md:grid-cols-4 gap-1 pt-1">
          <Image src={"/assets/5.png"} width={480} height={707} alt="image1" />
          <Image src={"/assets/7.png"} width={480} height={707} alt="image2" />
          <Image src={"/assets/1.png"} width={480} height={707} alt="image2" />
          <Image src={"/assets/6.png"} width={480} height={707} alt="image2" />
        </ul>
        {/* Third section with 2 photos */}
        <ul className="w-full h-full grid md:grid-cols-2 gap-1 pt-1">
          <Image src={"/assets/3.png"} width={950} height={1130} alt="image2" />
          <Image src={"/assets/4.png"} width={950} height={1130} alt="image2" />
        </ul>
        <VideoWithFallback />
        <ul className="h-full w-full grid md:grid-cols-3 gap-1 pt-1">
          <Image src={"/assets/5.png"} width={601} height={752} alt="image1" />
          <Image src={"/assets/7.png"} width={601} height={752} alt="image2" />
          <Image src={"/assets/1.png"} width={601} height={752} alt="image2" />
        </ul>
      </section>
    </>
  );
}
