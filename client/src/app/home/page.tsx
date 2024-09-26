import Image from "next/image";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Link from "next/link";
//import { pricingCards } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import VideoWithFallback from "@/components/video";

export default function Home() {
  return (
    <>
      {/* Hero section*/}
      <section className="h-full w-full relative flex items-center justify-center flex-col">
        {/* grid */}
        {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" /> */}

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
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            CAKE DENIM
          </h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-70px]">
          <Image
            src={"/assets/preview.png"}
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
        </div>
        <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
      </section>
      {/* Pricing Section */}
      <section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px]">
        <h2 className="text-4xl text-center">Choose what fits you right</h2>
        <p className="text-muted-foreground text-center">
          Our straightforward pricing plans are tailored to meet your needs. If
          {" you're"} not <br />
          ready to commit you can get started for free.
        </p>
        <div className="flex justify-center gap-4 flex-wrap mt-6">
          {/* {pricingCards.map((card) => (
            //WIP: Wire up free product from Strip
            <Card
              key={card.title}
              className={clsx("w-[300px] flex flex-col justify-between", {
                "border-2 border-primary": card.title === "Unlimited Saas",
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx("", {
                    "text-muted-foreground": card.title !== "Unlimited Saas",
                  })}
                >
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">{card.price}</span>
                <span className="text-muted-foreground">/m</span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {card.features.map((feature) => (
                    <div key={feature} className="flex gap-2 items-center">
                      <Check className="text-muted-foreground" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/agency?plan=${card.priceId}`}
                  className={clsx(
                    "w-full text-center bg-primary p-2 rounded-md",
                    { "!bg-muted-foreground": card.title !== "Unlimited Saas" }
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))} */}
        </div>
      </section>
    </>
  );
}
