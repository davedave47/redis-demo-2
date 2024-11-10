import DemoInterface from "./DemoInterface";
import {v7 as uuid} from "uuid"
import pool from "./postgisClient";
import { QueryResult } from "pg";
class PostGISDemo implements DemoInterface {
    constructor() {}
    public async getDriver(driver_id: string) {
        // return the name, car_model, car_color, license_plate based on id
        const query_result = await pool.query("SELECT name, car_model, car_color, license_plate FROM geo.driver WHERE id=$1", [driver_id]);
        const { name, car_model, car_color, license_plate } = query_result.rows[0];
        return { name: String(name), car_model: String(car_model), car_color: String(car_color), license_plate: String(license_plate) };
    }
    public async addDriver(name: string, car_model: string, car_color: string, license_plate: string) {
        const id = uuid().toString()
        //add driver and return the id
        await pool.query(
            "INSERT INTO geo.driver (id, name, car_model, car_color, license_plate) VALUES ($1, $2, $3, $4, $5)",
            [id, name, car_model, car_color, license_plate]
        );    
        const query = `insert`
        return id;
    }
    public async setLocation(driver_id: string, latitude: number, longitude: number) {
        // set the driver's location, return nothing
        const point = `POINT(${longitude} ${latitude})`;
        await pool.query(
            "UPDATE geo.driver SET location = ST_SetSRID(ST_GeomFromText($1), 4326) WHERE id = $2",
            [point, driver_id]
        );
    }
    public async getLocation(driver_id: string) {
        // return latitude and longitude
        const query_result = await pool.query("SELECT ST_Y(location) AS latitude, ST_X(location) AS longitude FROM geo.driver WHERE id=$1", [driver_id])
        if (query_result.rowCount != 0) {
           const {latitude, longitude} = query_result.rows[0]
            return {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            }
        }
        return null
    }
    public async getNearestDriver(latitude: number, longitude: number) {
        //return distance, latitude, longitude, name, car_model, car_color, license_plate of the nearest driver
        const tries = 5
        for (let radius = 2; radius < 2 + tries; radius++ ) {
            //look for nearest driver

            const query_result = await pool.query(
                `
                SELECT id, name, car_model, car_color, license_plate,
                       ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance,
                       ST_Y(location) AS latitude, ST_X(location) AS longitude
                FROM geo.driver
                WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
                ORDER BY distance
                LIMIT 1
                `,
                [longitude, latitude, radius*1000] // Note: longitude first
            );
        
            if (query_result.rowCount == 0) continue //no driver in this distance

            const driver = query_result.rows[0];
            return {
                distance: `${driver.distance} km`,
                latitude: parseFloat(driver.latitude), // Extract latitude
                longitude: parseFloat(driver.longitude), // Extract longitude
                name: driver.name,
                car_model: driver.car_model,
                car_color: driver.car_color,
                license_plate: driver.license_plate
            };
        }
        //return after 5 tries
        return null;
    }
}

export default PostGISDemo;