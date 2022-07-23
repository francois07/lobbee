import { PrismaClient } from "@prisma/client";
import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

declare global {
  var prisma: PrismaClient | undefined;
  var redis: RedisClientType | undefined;
}

export const prisma = global.prisma || new PrismaClient();
export const redis =
  global.redis ||
  createClient({
    url: process.env.REDIS_URL!,
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
  global.redis = redis;
}
