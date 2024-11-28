import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
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
  } catch (error) {
    logger.error("Failed to fetch parameter from SSM", {
      parameterName,
      error,
    });
    throw new Error(`Error fetching parameter: ${parameterName}`);
  }
}

// Load secrets and parameters into environment variables
export async function loadSecretsToEnv() {
  try {
    // Attempt to load secrets
    process.env.STRIPE_SECRET_KEY =
      process.env.STRIPE_SECRET_KEY ||
      (await getSSMParameterValue(stripeSecretKeyName)) ||
      (await getSecretValue(stripeSecretKeyName));

    process.env.STRIPE_WEBHOOK_SECRET =
      process.env.STRIPE_WEBHOOK_SECRET ||
      (await getSSMParameterValue(stripeWebhookSecretName)) ||
      (await getSecretValue(stripeWebhookSecretName));

    logger.info("Secrets loaded successfully into environment variables");
  } catch (error) {
    logger.error("Error loading secrets into environment variables", error);
    throw error;
  }
}
