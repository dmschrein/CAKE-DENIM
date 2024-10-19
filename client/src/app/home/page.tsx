"use client";
// client/src/app/home/page.tsx
import Image from "next/image";
//import { pricingCards } from "@/lib/constants";
import VideoWithFallback from "@/components/common/Video";
import PopupModal from "@/components/forms/PopupModal";

export default function HomePage() {
  return (
    <>
      {/* Hero section*/}
      <section className="relative flex h-full w-full flex-col items-center justify-center">
        {/* grid */}
        {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" /> */}
        {/* TODO: Update Popup to not show if the user is logged in */}
        <PopupModal />
        <Image
          src="/assets/cdbanner.jpg"
          width={1920}
          height={1080}
          alt="plur logo"
        />
        {/* TODO: Update to use FeatureProducts Function */}
        <ul className="grid h-full w-full gap-1 pt-1 md:grid-cols-4">
          <Image
            src="/assets/sweater.png"
            width={480}
            height={707}
            alt="image1"
          />
          <Image
            src="/assets/ochoa.png"
            width={480}
            height={707}
            alt="image2"
          />
          <Image
            src="/assets/jeansback.png"
            width={480}
            height={707}
            alt="image2"
          />
          <Image
            src="/assets/peron.png"
            width={480}
            height={707}
            alt="image2"
          />
        </ul>
        {/* Third section with 2 photos */}
        <ul className="grid h-full w-full gap-1 pt-1 md:grid-cols-2">
          <Image
            src="/assets/dress.png"
            width={950}
            height={1130}
            alt="image2"
          />
          <Image
            src="/assets/jumpsuit.png"
            width={950}
            height={1130}
            alt="image2"
          />
        </ul>
        <VideoWithFallback />
        {/* TODO: Update to use Blog Function */}
        <ul className="grid h-full w-full gap-1 pt-1 md:grid-cols-3">
          <Image
            src="/assets/cakebabe.png"
            width={601}
            height={752}
            alt="image1"
          />
          <Image
            src="/assets/cakebabe.png"
            width={601}
            height={752}
            alt="image2"
          />
          <Image
            src="/assets/cakebabe.png"
            width={601}
            height={752}
            alt="image2"
          />
        </ul>
      </section>
    </>
  );
}
