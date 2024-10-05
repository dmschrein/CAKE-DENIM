import csvParser from "csv-parser";
import fs from "fs";

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
  categories: [];
  variantSizes: [];
  variantColors: [];
}

interface ProductJSONFormat {
  productId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageURL: string;
  createdAt: string;
  updatedAt: string;
  Categories: Array<object>;
  ProductVariants: Array<object>;
  Reviews: Array<object>;
  OrderItems: Array<object>;
  Users: Array<object>;
}

// Interface for variant attributes (now used properly)
interface VariantAttributes {
  sizeCode: string;
  colorCode: string;
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

// Function to generate Variant ID
const generateVariantId = (sizeCode: string, colorCode: string): string => {
  console.log("Variant Ids generated: ", + ${sizeCode}-${colorCode});
  return `${sizeCode}-${colorCode}`;
};

// Generate the product variants from sizes and colors
const generateVariants = (
  sizes: string[],
  colors: string[],
  productId: string,
  price: number
): object[] => {
  const variants: object[] = [];
  sizes.forEach((size) => {
    colors.forEach((color) => {
      const variantId = generateVariantId(size, color); // Pass sizeCode and colorCode as separate strings
      variants.push({
        variantId,
        productId,
        sizeId: size,
        colorId: color,
        price: price, // use product price for now
        stockQuantity: 0, // Placeholder for stock quantity
      });
    });
  });
  return variants;
};

// Parse the CSV and generate product JSON
const generateProductsFromCSV = () => {
  const products: ProductJSONFormat[] = [];
  const variantsData: { [key: string]: VariantAttributes[] } = {}; // Store variants

  // path to the CSV file
  const productsCsvPath = "./inputData/ProductsTable.csv";
  const variantsCsvPath = "./inputData/VariantCodes.csv";

  // Ensure the seedData directory exists, create it if not
  if (!fs.existsSync("./seedData")) {
    fs.mkdirSync("./seedData");
  }

  // Read variants CSV file and store variants data
  fs.createReadStream(variantsCsvPath)
    .pipe(csvParser())
    .on("data", (row: any) => {
      const productCode = row.ProductCode;
      if (!variantsData[productCode]) {
        variantsData[productCode] = [];
      }
      // Push the size and color data into the variant array for this product
      variantsData[productCode].push({
        sizeCode: row.SizeCode, // Correctly extracting SizeCode and ColorCode
        colorCode: row.ColorCode,
      });
    })
    .on("end", () => {
      // Read products CSV file and generate products JSON
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
            categories: row.Categories,
            variantSizes: row.VariantSizes.split(","), // Assuming sizes are separated by commas
            variantColors: row.VariantColors.split(","), // Assuming colors are separated by commas
          };

          const productId = generateProductId(product);
          const productVariants = generateVariants(
            product.variantSizes,
            product.variantColors,
            productId,
            product.price
          );

          // Structure the product data for JSON format
          const productJSON: ProductJSONFormat = {
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
                categoryName: row.Categories,
                description: "",
                Product: [],
              },
            ],
            ProductVariants: productVariants,
            Reviews: [],
            OrderItems: [],
            Users: [],
          };
          products.push(productJSON);
        })
        .on("end", () => {
          // Write to JSON file
          fs.writeFileSync(
            "./seedData/products.json",
            JSON.stringify(products, null, 2)
          );
          console.log(
            "Product data has been successfully written to seedData/products.json"
          );
        });
    });
};

generateProductsFromCSV();
