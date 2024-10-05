import fs from "fs";
import csvParser from "csv-parser";

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
}

interface ProductJSONFormat {
  productId: string;
  name: string;
  description: string;
  price: string;
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

// Parse the CSV and generate product JSON
const generateProductsFromCSV = () => {
  const products: ProductJSONFormat[] = [];

  // Path to the CSV file
  const csvFilePath = "./inputData/ProductTable.csv";

  // Ensure the seedData directory exists, create it if not
  if (!fs.existsSync("./seedData")) {
    fs.mkdirSync("./seedData");
  }

  fs.createReadStream(csvFilePath)
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
      };
      const productId = generateProductId(product);

      // Structure the product data for JSON format
      const productJSON: ProductJSONFormat = {
        productId,
        name: product.name,
        description: product.description,
        price: "",
        stockQuantity: 0,
        imageURL: "",
        createdAt: "",
        updatedAt: "",
        Categories: [
          { categoryId: "", categoryName: "", description: "", Product: [] },
        ],
        ProductVariants: [{}],
        Reviews: [
          {
            reviewId: "",
          },
        ],
        OrderItems: [],
        Users: [],
      };
      products.push(productJSON);
    })
    .on("end", () => {
      // Write to JSON file
      fs.writeFileSync(
        "./seedData/products_test.json",
        JSON.stringify(products, null, 2)
      );
      console.log(
        "Product data has been successfully written to seedData/products_test.json"
      );
    });
};

// Run the function to generate products
generateProductsFromCSV();
