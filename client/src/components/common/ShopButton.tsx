import { FC } from "react";
import Link from "next/link";
import { Url } from "url";

interface ShopProps {
  href: string | Url;
  text: string;
  subheading: string;
}

const ShopButton: FC<ShopProps> = ({ href, text, subheading }) => {
  console.log("ShopButton rendered");
  return (
    <Link href={href}>
      <button className="absolute bottom-10 left-10 flex flex-col items-start text-white">
        <h2 className="text-3xl">{text}</h2>
        <h3 className="text-xs">{subheading}</h3>
      </button>
    </Link>
  );
};

export default ShopButton;
