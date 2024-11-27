// server/src/utils/secrets.ts

import AWS from "aws-sdk";

const ssm = new AWS.SSM();

export const getSSMParameter = async (name: string): Promise<string> => {
  const response = await ssm
    .getParameter({ Name: name, WithDecryption: true })
    .promise();
  return response.Parameter?.Value || "";
};
