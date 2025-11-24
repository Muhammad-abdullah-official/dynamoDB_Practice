import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { db, Table } from "../config/dynamo.js";
import { v4 as uuid } from "uuid";

export const createUser = async (name, phoneNo, address) => {
  const userId = uuid();
  const itemUser = {
    PK: `USER#${userId}`,
    SK: `PROFILE`,
    EntityType: "User",
    userId,
    name,
    phoneNo,
    address,
    createdAt: Date.now(),
  };

  const phoneItem = {
    PK: `PHONENO#${phoneNo}`,
    SK: `USER#${userId}`,
    EntityType: "PhoneMap",
    userId,
    phoneNo,
  };

  await db.send(
    new PutCommand({
      TableName: Table,
      Item: itemUser,
    })
  );
  await db.send(
    new PutCommand({
      TableName: Table,
      Item: phoneItem,
    })
  );
  //   return result.itemUser;
};

export const getUserById = async (userId) => {
  const result = await db.send(
    new GetCommand({
      TableName: Table,
      KEY: { PK: `USER#${userId}`, SK: `PROFILE` },
    })
  );
  return result.Item;
};

export const getUserByPhoneNo = async (phoneNo) => {
  const result = await db.send(
    new GetCommand({
      TableName: Table,
      KEY: { PK: `PHONENO#${phoneNo}`, SK: `USER#` + "" },
    })
  );
  return result.Item;
};
