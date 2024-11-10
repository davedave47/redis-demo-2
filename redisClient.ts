import { createClient } from "redis";
import "dotenv/config";
// Create a redis client
const redisClient = createClient({url: "redis://default:duy123@localhost:6379/1"});
// Connect to redis
redisClient.connect().then(() => {
    console.log("Redis connected");
})
redisClient.flushAll()

export default redisClient;