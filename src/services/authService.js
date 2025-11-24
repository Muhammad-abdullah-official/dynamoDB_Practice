import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { db, Table } from "../config/dynamo.js";
import { createUser, findUserByPhone, getUserById } from "./userService.js";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";

const SALT_ROUNDS = 10;

export async function signUp({ name, phone, address, password }) {
  // check phone exists
  const existing = await findUserByPhone(phone);
  if (existing) {
    const err = new Error("User with phone already exists");
    err.status = 400;
    err.expose = true;
    throw err;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({ name, phone, address });

  // store password hash on user's profile item (update)
  await db.send(
    new UpdateCommand({
      TableName: Table,
      Key: { PK: user.PK, SK: user.SK },
      UpdateExpression: "SET passwordHash = :ph",
      ExpressionAttributeValues: { ":ph": hashed },
    })
  );

  delete user.passwordHash;
  return user;
}

export async function login({ phone, password }) {
  const user = await findUserByPhone(phone);
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    err.expose = true;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.passwordHash || "");
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    err.expose = true;
    throw err;
  }

  const accessToken = jwt.sign({ sub: user.userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  const refreshToken = uuid();
  const ttlSeconds =
    Math.floor(Date.now() / 1000) + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60;

  // persist refresh token and ttl
  await db.send(
    new UpdateCommand({
      TableName: Table,
      Key: { PK: user.PK, SK: user.SK },
      UpdateExpression: "SET refreshToken = :rt, refreshTokenTTL = :ttl",
      ExpressionAttributeValues: { ":rt": refreshToken, ":ttl": ttlSeconds },
    })
  );

  // return safe user object
  const safeUser = { userId: user.userId, name: user.name, phone: user.phone };
  return { accessToken, refreshToken, user: safeUser };
}

export async function refreshAccessToken({ userId, refreshToken }) {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  if (user.refreshToken !== refreshToken) {
    const err = new Error("Invalid refresh token");
    err.status = 401;
    err.expose = true;
    throw err;
  }
  const now = Math.floor(Date.now() / 1000);
  if (user.refreshTokenTTL && user.refreshTokenTTL < now) {
    const err = new Error("Refresh token expired");
    err.status = 401;
    err.expose = true;
    throw err;
  }
  const accessToken = jwt.sign({ sub: user.userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  return { accessToken };
}
