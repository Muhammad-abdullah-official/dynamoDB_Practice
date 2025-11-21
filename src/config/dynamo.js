import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: "us-east-1",
    endpoint:"http://localhost/8000" //points to dynamodb local not dynamodb admin
})

export const db = DynamoDBDocumentClient.from(client)
export const Table = "FitnessAppTable"