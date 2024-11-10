import { createClient } from "redis";
import "dotenv/config";
// Create a redis client
const redisClient = createClient({url: process.env.REDIS_URL});
// Connect to redis
redisClient.connect().then(() => {
    console.log("Redis connected");
})

export default redisClient;