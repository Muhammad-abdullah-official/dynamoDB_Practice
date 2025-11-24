import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";
dotenv.config();
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.DYNAMO_ENDPOINT || "http://localhost:8000", //points to dynamodb local not dynamodb admin
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake",
  },
  maxAttempts: 3,
});

export const db = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export const Table = "FitnessAppTable";
