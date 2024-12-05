import Image from "next/image";

type ProductImageProps = {
  src: string; // Remote image source
  alt: string;
  fallbackSrc?: string; // Local fallback image
  width?: number; // Optional width
  height?: number; // Optional height
  priority?: any;
};

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  fallbackSrc,
  width = 400,
  height = 400,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <Image
      src={isDevelopment && fallbackSrc ? fallbackSrc : src}
      alt={alt}
      width={width}
      height={height}
      priority
    />
  );
};

export default ProductImage;
