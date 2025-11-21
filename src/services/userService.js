// Import PutCommand and GetCommand which allow us to write (Put) and read (Get) items from DynamoDB
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

// Import our DynamoDB DocumentClient instance (db) and the table name (Table)
import { db, Table } from "../config/dynamo.js";

// Import UUID generator for creating unique IDs for users
import { v4 as uuid } from "uuid";


// Exporting a function to create a new user in DynamoDB
export async function createUser(name, phNo, address) {

    // Generate a unique ID for the user using uuid()
    const userId = uuid();

    // This is the item (row) we will write into DynamoDB
    const itemUser = {

        // Partition Key: Used to group related items. Here it identifies a specific user.
        PK: `USER#${userId}`,

        // Sort Key: Used to distinguish items under the same PK. "PROFILE" means this is the profile record.
        SK: `PROFILE`,

        // Optional field: Helps you identify what type of entity this item is when querying.
        EntityType: "User",

        // The actual user name we received as function input
        name,
        phNo,
        address
    };

    // Write (Put) the item into DynamoDB
    await db.send(
        new PutCommand({
            // The name of the DynamoDB table we are inserting into
            TableName: Table,

            // The item (object) that we want DynamoDB to store
            Item: itemUser
        })
    );

    return itemUser
}



// Exporting a function that retrieves a user by userId
export async function getUser(userId) {

    // Send a GetCommand to DynamoDB to read a single item
    const result = await db.send(
        new GetCommand({
            // The table we want to read from
            TableName: Table,

            // The PRIMARY KEY of the item we want to fetch
            Key: {
                // Same PK used to create the user
                PK: `USER#${userId}`,

                // Same SK we used earlier — we specifically want the PROFILE item
                SK: `PROFILE`
            }
        })
    );

    // The `.Item` property contains the actual DynamoDB record returned
    return result.Item;
}
