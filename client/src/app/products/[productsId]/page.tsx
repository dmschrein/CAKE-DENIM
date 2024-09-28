import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {};

const Products = (props: Props) => {
  return (
    <div className="flex flex-col md:flex-row space-x-8">
      {/* Product Image Gallery */}
      <div className="flex flex-row space-x-2">
        {/* Product Main Image */}
        <Image
          src="/assets/3.png"
          alt="Dress Example"
          width={600}
          height={800}
        />
        {/* Thumbnails */}
        <div className="flex flex-col space-y-2">
          <Image src="/assets/3.png" alt="Dress" width={100} height={150} />
          <Image src="/assets/3.png" alt="Dress" width={100} height={150} />
          <Image src="/assets/3.png" alt="Dress" width={100} height={150} />
          <Image src="/assets/3.png" alt="Dress" width={100} height={150} />
        </div>
      </div>
      {/* Product Text Description */}
      <div className="flex-1">
        <h1>ABRIL GOWN</h1>
        <p className="text-2xl text-gray-700 mt-4">$500</p>

        {/* Afterpay */}
        <p className="text-sm text-gary-500 mt-2">
          Pay as low as <strong>$70/mo</strong> with Klarna, or{" "}
          <strong>$103.65/mo</strong> with Afterpay.
        </p>
        {/* Product Description */}
        <p className="mt-6">
          A strapless column gown with signature gold hardware cutout at the
          front bust.
          <ul className="list-disc list-inside mt-4">
            <li>Maxi length</li>
            <li>Fitted bodice</li>
            <li>Plunging neckline</li>
            <li>Gold bust hardware</li>
          </ul>
        </p>
        {/* Color Selection */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Color</h3>
          <div className="flex space-x-2 mt-2">
            <button className="w-8 h-8 bg-black rounded-full border border-gray-300"></button>
          </div>
        </div>
        {/* Size Selection */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Size</h3>
          <div>
            {["00", "0", "2", "4", "6", "8", "10", "12"].map((size) => (
              <Button
                variant="link"
                size="sm"
                type="submit"
                className="p-2 rounded text-center"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
        {/* Add to Bag Button */}
        <div className="flex flex-row space-x-2">
          <Button
            variant="outline"
            size="lg"
            type="submit"
            className="w-full mt-6 py-3 text-black"
          >
            ADD TO BAG
          </Button>
          {/* Save Button */}
          <Button
            variant="outline"
            size="lg"
            type="submit"
            className="mt-6 py-3 bg-gray-200 text-black"
          >
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Products;
