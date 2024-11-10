import redisClient from "./redisClient";
import {v7 as uuid} from "uuid"
import { GeoReplyWith } from "redis";
import DemoInterface from "./DemoInterface";
class RedisDemo implements DemoInterface {
    constructor() {}
    public async getDriver(driver_id: string) {
        const driver = await redisClient.hGetAll(driver_id);
        return {
            name: driver.name,
            car_model: driver.model,
            car_color: driver.car_color,
            license_plate: driver.license_plate
        };
    }
    public async addDriver(name: string, car_model: string, car_color: string, license_plate: string) {
        const driver_id = `driver:${uuid()}`
        await redisClient.hSet(driver_id, {
            name,
            car_model,
            car_color,
            license_plate
        })
        return driver_id;
    } 
    public async setLocation(driver_id: string, latitude: number, longitude: number) {
        await redisClient.GEOADD("drivers", {
            latitude,
            longitude,
            member: driver_id
        })
    }
    public async getLocation(driver_id: string) {
        const locations = await redisClient.geoPos("drivers", driver_id)
        if (locations.length && locations[0]) {
            return {
                latitude: parseFloat(locations[0].latitude),
                longitude: parseFloat(locations[0].longitude)
            }
        }
        return null
    }
    public async getNearestDriver(latitude: number, longitude: number) {
        const tries = 5;
        for (let radius = 2; radius < 2 + tries; radius++) { 
        const driver_ids = await redisClient.geoSearchWith(
            "drivers", {
                latitude,
                longitude
            },
            {
                radius,
                unit: "km"
            },
            [GeoReplyWith.COORDINATES, GeoReplyWith.DISTANCE],
            {
                SORT: "ASC",
            }
        )
        if (driver_ids.length) {
            const {member: driver_id, distance, coordinates} = driver_ids[0];
            const driver = await this.getDriver(driver_id)
            if (!coordinates || !coordinates.latitude || !coordinates.longitude) return null
            return {
                distance: `${distance} km`,
                latitude: parseFloat(coordinates.latitude),
                longitude: parseFloat(coordinates.longitude),
                ...driver
            }
        }
    }
        return null
    }
}

export default RedisDemo;