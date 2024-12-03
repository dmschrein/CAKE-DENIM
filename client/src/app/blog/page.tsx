"use client";

import Image from "next/image";

const blogPosts = [
  {
    id: 1,
    title: "SLICE Vol. 01",
    subtitle: "Book Lovers",
    date: "Sep '24",
    imgSrc: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/bookstand.png",
    alt: "Blog Post 1",
  },
  {
    id: 2,
    title: "SLICE Vol. 02",
    subtitle: "Wanderlust",
    date: "Aug '24",
    imgSrc: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/bridgeitaly.png",
    alt: "Blog Post 2",
  },
  {
    id: 3,
    title: "SLICE Vol. 03",
    subtitle: "Travel Log",
    date: "Sep '24",
    imgSrc: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/dancing.png",
    alt: "Blog Post 3",
  },
  {
    id: 4,
    title: "SLICE Vol. 04",
    subtitle: "Summer Reflections",
    date: "Sep '24",
    imgSrc: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/girlsparis.png",
    alt: "Blog Post 4",
  },
  // Add more blog post objects here, up to 14
];

export default function BlogPage() {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center">
      <div className="grid w-full grid-cols-2">
        {blogPosts.map((post) => (
          <div key={post.id} className="relative">
            {/* Blog Image */}
            <Image
              src={post.imgSrc}
              width={700}
              height={450}
              alt={post.alt}
              className="h-auto w-full"
            />
            {/* Blog Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-transparent text-white">
              <hr className="border-white" />
              <div className="flex justify-between px-4 py-2">
                <p className="text-sm">
                  {post.title} <span className="italic">{post.subtitle}</span>{" "}
                  {/* Title in normal, subtitle in italics */}
                </p>
                <p className="text-sm italic">{post.date}</p>{" "}
                {/* Italic for date */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
