import fs from "fs";
import csvParser from "csv-parser";

// Interface for Product and Variants
interface ProductAttributes {
  productCode: string;
  categoryCode: string;
  fitCode: string;
  waistbandCode: string;
  fabricCode: string;
  washFinishCode: string;
  productionRound: string;
  destinationCode: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageURL: string;
  createdAt: string;
  updatedAt: string;
  variantSizes: string[];
  variantColors: string[];
}

interface ProductVariantAttributes {
  variantId: string;
  productId: string;
  sizeId: string;
  colorId: string;
  price: number;
  stockQuantity: number;
}

// Function to generate Product IDs based on fields
const generateProductId = ({
  productCode,
  categoryCode,
  fitCode,
  waistbandCode,
  fabricCode,
  washFinishCode,
  productionRound,
  destinationCode,
}: ProductAttributes): string => {
  return `${productCode}-${categoryCode}${fitCode}${waistbandCode}-${fabricCode}${washFinishCode}-${productionRound}${destinationCode}`;
};

// Function to generate Variant IDs based on size and color codes
const generateVariantId = ({
  productId,
  sizeId,
  colorId,
}: {
  productId: string;
  sizeId: string;
  colorId: string;
}): string => {
  return `${productId}-${sizeId}-${colorId}`;
};

// Generate the product variants
const generateVariants = (
  sizes: string[],
  colors: string[],
  productId: string,
  price: number
): ProductVariantAttributes[] => {
  const variants: ProductVariantAttributes[] = [];
  sizes.forEach((size) => {
    colors.forEach((color) => {
      const variantId = generateVariantId({
        productId,
        sizeId: size,
        colorId: color,
      });
      console.log(
        `Generating variant: ${variantId} for product ${productId} (Size: ${size}, Color: ${color})`
      );
      variants.push({
        variantId,
        productId,
        sizeId: size,
        colorId: color,
        price,
        stockQuantity: 100, // Example default stock, you can replace this value
      });
    });
  });
  return variants;
};

// Parse the CSV and generate product JSON
const generateProductsFromCSV = () => {
  const products: any[] = [];

  // Path to the CSV file
  const productsCsvPath = "./inputData/ProductsTable.csv";

  // Ensure the seedData directory exists, create it if not
  if (!fs.existsSync("./seedData")) {
    fs.mkdirSync("./seedData");
  }

  fs.createReadStream(productsCsvPath)
    .pipe(csvParser())
    .on("data", (row: any) => {
      const product: ProductAttributes = {
        productCode: row.ProductCode,
        categoryCode: row.Category,
        fitCode: row.Fit,
        waistbandCode: row.Waistband,
        fabricCode: row.Fabric,
        washFinishCode: row.WashFinish,
        productionRound: row.ProductionRound,
        destinationCode: row.Destination,
        name: row.ProductName,
        description: row.Description,
        price: parseFloat(row.Price),
        stockQuantity: parseInt(row.StockQuantity, 10),
        imageURL: row.ImageURL,
        createdAt: row.CreatedAt,
        updatedAt: row.UpdatedAt,
        variantSizes: row.VariantSizes.split(", "), // Assumed sizes are comma-separated
        variantColors: row.VariantColors.split(", "), // Assumed colors are comma-separated
      };

      const productId = generateProductId(product);
      console.log(`Processing product: ${productId} - ${product.name}`);

      const productVariants = generateVariants(
        product.variantSizes,
        product.variantColors,
        productId,
        product.price
      );

      // Structure the product data for JSON format
      const productJSON = {
        productId,
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        imageURL: product.imageURL,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        Categories: [
          {
            categoryId: "",
            categoryName: row.Category,
            description: "",
            Product: [],
          },
        ],
        ProductVariants: productVariants,
        Reviews: [],
        OrderItems: [],
        Users: [],
      };

      console.log(
        `Generated ${productVariants.length} variants for product ${productId}`
      );
      products.push(productJSON);
    })
    .on("end", () => {
      // Write to JSON file
      console.log("Writing data to products.json...");
      fs.writeFileSync(
        "./seedData/products.json",
        JSON.stringify(products, null, 2)
      );
      console.log(
        "Product data has been successfully written to seedData/products.json"
      );
    });
};

generateProductsFromCSV();
