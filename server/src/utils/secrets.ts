import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { config } from "dotenv";
import logger from "./logger";

// Environment setup
config();

// AWS SDK clients
const secretsManagerClient = new SecretsManagerClient({
  region: process.env.AWS_REGION || "us-west-1",
});
const ssmClient = new SSMClient({
  region: process.env.AWS_REGION || "us-west-1",
});

// Secrets and Parameters
const stripeSecretKeyName = "/stripe/secret_key"; // Ensure this matches your SSM parameter name
const stripeWebhookSecretName = "/stripe/webhook_secret"; // Ensure this matches your SSM parameter name

// Fetch secrets from AWS Secrets Manager
export async function getSecretValue(
  secretId: string
): Promise<string | undefined> {
  try {
    logger.debug("Fetching secret from Secrets Manager", { secretId });
    const response = await secretsManagerClient.send(
      new GetSecretValueCommand({ SecretId: secretId })
    );
    return response.SecretString || "";
  } catch (error) {
    logger.error("Failed to fetch secret from Secrets Manager", {
      secretId,
      error,
    });
    throw new Error(`Error fetching secret: ${secretId}`);
  }
}

// Fetch parameters from AWS SSM Parameter Store
export async function getSSMParameterValue(
  parameterName: string
): Promise<string | undefined> {
  try {
    logger.debug("Fetching parameter from SSM", { parameterName });
    const response = await ssmClient.send(
      new GetParameterCommand({ Name: parameterName, WithDecryption: true })
    );
    return response.Parameter?.Value || "";
  } catch (error: any) {
    logger.error("Failed to fetch parameter from SSM", {
      parameterName,
      error: error.message || error,
    });

    if (process.env.NODE_ENV === "development") {
      logger.warn(
        `Falling back to local environment variable for ${parameterName}`
      );
      return process.env[parameterName];
    }

    throw new Error(`Error fetching parameter: ${parameterName}`);
  }
}

// Load secrets and parameters into environment variables
export async function loadSecretsToEnv() {
  try {
    console.log("Fetching Stripe secret keys from SSM and Secrets Manager...");
    process.env.STRIPE_SECRET_KEY =
      process.env.STRIPE_SECRET_KEY ||
      (await getSSMParameterValue(stripeSecretKeyName).catch(() => "")) ||
      (await getSecretValue(stripeSecretKeyName).catch(() => ""));

    console.log("STRIPE_SECRET_KEY loaded:", !!process.env.STRIPE_SECRET_KEY);

    process.env.STRIPE_WEBHOOK_SECRET =
      process.env.STRIPE_WEBHOOK_SECRET ||
      (await getSSMParameterValue(stripeWebhookSecretName).catch(() => "")) ||
      (await getSecretValue(stripeWebhookSecretName).catch(() => ""));

    console.log(
      "STRIPE_WEBHOOK_SECRET loaded:",
      !!process.env.STRIPE_WEBHOOK_SECRET
    );

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      logger.error("Critical Stripe secrets are missing.");
      throw new Error("Failed to load Stripe secrets");
    }

    logger.info("Secrets loaded successfully into environment variables");
  } catch (error) {
    logger.error("Error loading secrets into environment variables", { error });
    throw error;
  }
}

export async function validateAWSCredentials() {
  try {
    const credentialsProvider = fromNodeProviderChain();
    const credentials = await credentialsProvider();
    console.log("AWS credentials resolved successfully:", credentials);
  } catch (error: any) {
    console.error("Failed to resolve AWS credentials:", error.message);
    throw error;
  }
}

(async () => {
  await validateAWSCredentials();
})();
