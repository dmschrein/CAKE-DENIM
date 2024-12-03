"use client";
// client/src/app/home/page.tsx
import Image from "next/image";
//import { pricingCards } from "@/lib/constants";
import VideoWithFallback from "@/components/common/Video";
import PopupModal from "@/components/forms/PopupModal";
import Link from "next/link";
import ShopButton from "@/components/common/ShopButton";

export default function HomePage() {
  const products = [
    {
      id: "her3-cd1f1wb2-fb1ws2-pr1d1",
      image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/hersel1-63.jpg",
      alt: "Raw Denim Shirt",
    },
    {
      id: "och8-cd8f3wb0-fb3ws0-pr1d1",
      image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/ochoa.png",
      alt: "Ochoa Body Suit",
    },
    {
      id: "mor2-cd1f1wb2-fb1ws1-pr1d1",
      image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/jeansback.png",
      alt: "Jeans Back",
    },
    {
      id: "per18-cd7f0fb5-ws0-pr1d1",
      image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/peron1-102.jpg",
      alt: "Peron Product",
    },
  ];
  return (
    <>
      {/* Hero section*/}
      <section className="relative flex h-full w-full flex-col items-center justify-center">
        {/* grid */}
        {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" /> */}
        {/* TODO: Update Popup to not show if the user is logged in */}
        <PopupModal />
        <div className="relative">
          <Image
            src="https://s3-cakedenim.s3.us-west-1.amazonaws.com/banner-374.jpg"
            width={1920}
            height={1080}
            alt="Hero banner showing a feature denim jacket product"
            priority
          />
          <ShopButton
            href="/products/shopAll"
            text="SHOP THE COLLECTION"
            subheading=""
          />
        </div>

        {/* TODO: Update to use FeatureProducts Function */}
        <ul className="grid h-full w-full gap-1 pt-1 md:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Image
                src={product.image}
                width={480}
                height={707}
                alt={product.alt}
              />
            </Link>
          ))}
        </ul>
        {/* Third section with 2 photos */}
        <ul className="grid h-full w-full gap-1 pt-1 md:grid-cols-2">
          <div className="relative">
            <Image
              src="https://s3-cakedenim.s3.us-west-1.amazonaws.com/dress.png"
              width={950}
              height={1130}
              alt="image2"
            />
            <ShopButton
              href={"/dresses"}
              text={"DRESSES"}
              subheading="SHOP NOW"
            />
          </div>
          <div className="relative">
            <Image
              src="https://s3-cakedenim.s3.us-west-1.amazonaws.com/jumpsuit.png"
              width={950}
              height={1130}
              alt="image2"
            />
            <ShopButton href={"/jeans"} text={"JEANS"} subheading="SHOP NOW" />
          </div>
        </ul>
        <VideoWithFallback />
        {/* TODO: Update to use Blog Function */}
        <ul className="grid h-full w-full gap-1 pt-1 md:grid-cols-3">
          <Link href={"/blog"}>
            <Image
              src="https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png"
              width={601}
              height={752}
              alt="image1"
            />
          </Link>
          <Link href={"/blog"}>
            <Image
              src="https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png"
              width={601}
              height={752}
              alt="image2"
            />
          </Link>
          <Link href={"/blog"}>
            <Image
              src="https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png"
              width={601}
              height={752}
              alt="image2"
            />
          </Link>
        </ul>
      </section>
    </>
  );
}
