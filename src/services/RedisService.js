import dotenv from "dotenv";
import { createClient } from "redis";
import { env } from "../configs/constants.js";
import customLogger from "../helpers/customLogger.js";

dotenv.config();

const pathToLog =
    env.NODE_ENV === "test"
        ? "logs/redis/test-redis.log"
        : "logs/redis/redis.log";
const logger = customLogger(pathToLog);

const DEFAULT_EXPIRATION = 60;

const redisClient = createClient({
    url: `redis://default:${env.REDIS_PASSWORD}@localhost:${env.REDIS_PORT}`,
});

function constructKey(key) {
    return env.NODE_ENV !== "test" ? key : `__test:${key}`;
}

async function connectRedis() {
    try {
        await redisClient.connect();
        logger.info("Redis connected");
        await redisClient.set("server", "Resolver-Service");
    } catch (error) {
        throw error;
    }
}

const RedisService = () => {
    return {
        async pullFromCache(key) {
            const data = await redisClient.get(key);
            return JSON.parse(data);
        },
        async getCacheValue(key) {
            const cacheKey = constructKey(key);
            try {
                return await this.pullFromCache(cacheKey);
            } catch (err) {
                return undefined;
            }
        },
        async setCacheValue(key, value, expiredTime = DEFAULT_EXPIRATION) {
            const cacheKey = constructKey(key);
            await redisClient.set(cacheKey, JSON.stringify(value));
            if (expiredTime > 0) {
                await redisClient.expire(cacheKey, expiredTime);
            }
        },
        async deleteCacheValue(key) {
            const cacheKey = constructKey(key);

            await redisClient.del(cacheKey);
        },
    };
};

await connectRedis();

export { RedisService, redisClient };
