const fs = require("fs");
import csvParser from "csv-parser";

interface VariantAttributes {
  productCode: string;
  sizeCode: string;
  colorCode: string;
  price: number;
  stockQuantity: number;
}

interface ProductVariantJSONFormat {
  variantId: string;
  productId: string;
  sizeId: string;
  colorId: string;
  price: number;
  stockQuantity: number;
}

// Function to generate Variant IDs based on size and color codes
const generateVariantId = ({
  sizeCode,
  colorCode,
}: VariantAttributes): string => {
  return `${colorCode}${sizeCode}`;
};

// Function to generate product variants
const generateVariantFromCSV = (
  productCsvPath: string,
  variantCsvPath: string
) => {
  const variantsData: Record<string, VariantAttributes[]> = {};

  // Step 1: Read the VariantCodes.csv and collect variant data
  console.log(`Reading variant data from ${variantCsvPath}...`);
  fs.createReadStream(variantCsvPath)
    .pipe(csvParser())
    .on("data", (row: any) => {
      const productCode = row.ProductCode;
      if (!variantsData[productCode]) {
        variantsData[productCode] = [];
      }
      variantsData[productCode].push({
        productCode: row.ProductCode,
        sizeCode: row.SizeCode,
        colorCode: row.ColorCode,
        price: parseFloat(row.Price),
        stockQuantity: parseInt(row.StockQuantity, 10),
      });
    })
    .on("end", () => {
      console.log("Variants data loaded successfully.");
      console.log("Variants Data: ", JSON.stringify(variantsData, null, 2));

      // Step 2: Read the ProductsTable.csv and generate ProductVariant data
      console.log(`Reading product data from ${productCsvPath}...`);
      const productVariants: ProductVariantJSONFormat[] = [];
      fs.createReadStream(productCsvPath)
        .pipe(csvParser())
        .on("data", (row: any) => {
          const productCode = row.ProductCode;
          const productId = productCode;

          // Check if the product has associated variants
          if (variantsData[productCode]) {
            const variants = variantsData[productCode];

            // Generate ProductVariant records
            variants.forEach((variant) => {
              const variantId = generateVariantId({
                productCode,
                sizeCode: variant.sizeCode,
                colorCode: variant.colorCode,
                price: variant.price,
                stockQuantity: variant.stockQuantity,
              });
              const productVariant: ProductVariantJSONFormat = {
                variantId,
                productId,
                sizeId: variant.sizeCode,
                colorId: variant.colorCode,
                price: variant.price,
                stockQuantity: variant.stockQuantity,
              };
              console.log(
                `Generated variant for product ${productId}: `,
                JSON.stringify(productVariant, null, 2)
              );
              productVariants.push(productVariant);
            });
          } else {
            console.log(`No variants found for product ${productCode}`);
          }
        })
        .on("end", () => {
          // Step 3: Write the generated product variants to a JSON file
          const outputFilePath = "./seedData/productVariants.json";
          fs.writeFileSync(
            outputFilePath,
            JSON.stringify(productVariants, null, 2)
          );
          console.log(
            `Product variants data has been successfully written to ${outputFilePath}`
          );
        });
    });
};

const productCsvPath = "./inputData/ProductsTable.csv";
const variantCsvPath = "./inputData/VariantsTable.csv";

generateVariantFromCSV(productCsvPath, variantCsvPath);
