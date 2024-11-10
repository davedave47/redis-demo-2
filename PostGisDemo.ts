import DemoInterface from "./DemoInterface";
import {v7 as uuid} from "uuid"
import pool from "./postgisClient";
class PostGISDemo implements DemoInterface {
    constructor() {}
    public async getDriver(driver_id: string) {
        // return the name, car_model, car_color, license_plate based on id
        return {
            name: ,
            car_model: ,
            car_color: ,
            license_plate: ,
        }
    }
    public async addDriver(name: string, car_model: string, car_color: string, license_plate: string) {
        const id = uuid().toString()
        //add driver and return the id
        return id;
    }
    public async setLocation(driver_id: string, latitude: number, longitude: number) {
        // set the driver's location, return nothing
    }
    public async getLocation(driver_id: string) {
        // return latitude and longitude
        return {
            latitude: ,
            longitude:
        }
    }
    public async getNearestDriver(latitude: number, longitude: number) {
        //return distance, latitude, longitude, name, car_model, car_color, license_plate of the nearest driver
        const tries = 5
        for (let radius = 2; radius < 2 + tries; radius++ ) {
            //look for nearest driver
            return {
                distance: `${distance} km`,
                latitude: ,
                longitude: ,
                name: ,
                car_model: ,
                car_color: ,
                license_plate: ,
            }
        }
        //return after 5 tries
        return null;
    }
}

export default PostGISDemo;