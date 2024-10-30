"use client";

import Image from "next/image";

const blogPosts = [
  {
    id: 1,
    title: "SLICE Vol. 01",
    subtitle: "Book Lovers",
    date: "Sep '24",
    imgSrc: "/assets/bookstand.png",
    alt: "Blog Post 1",
  },
  {
    id: 2,
    title: "SLICE Vol. 02",
    subtitle: "Wanderlust",
    date: "Aug '24",
    imgSrc: "/assets/bridgeitaly.png",
    alt: "Blog Post 2",
  },
  {
    id: 3,
    title: "SLICE Vol. 03",
    subtitle: "Travel Log",
    date: "Sep '24",
    imgSrc: "/assets/dancing.png",
    alt: "Blog Post 3",
  },
  {
    id: 4,
    title: "SLICE Vol. 04",
    subtitle: "Summer Reflections",
    date: "Sep '24",
    imgSrc: "/assets/girlsparis.png",
    alt: "Blog Post 4",
  },
  // Add more blog post objects here, up to 14
];

export default function BlogPage() {
  return (
    <section className="h-full w-full flex items-center justify-center flex-col">
      <div className="grid grid-cols-2 w-full">
        {blogPosts.map((post) => (
          <div key={post.id} className="relative">
            {/* Blog Image */}
            <Image
              src={post.imgSrc}
              width={700}
              height={450}
              alt={post.alt}
              className="w-full h-auto"
            />
            {/* Blog Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-transparent text-white">
              <hr className="border-white" />
              <div className="flex justify-between px-4 py-2">
                <p className="text-sm">
                  {post.title} <span className="italic">{post.subtitle}</span> {/* Title in normal, subtitle in italics */}
                </p>
                <p className="text-sm italic">{post.date}</p>  {/* Italic for date */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
