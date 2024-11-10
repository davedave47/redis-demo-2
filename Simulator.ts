import {faker} from "@faker-js/faker"
import { computeDestinationPoint } from 'geolib';
import DemoInterface from "./DemoInterface";
const MAX_DISTANCE = 5
const MAX_LATITUDE = 85.05112878
const MAX_LONGITUDE = 180

class Simulator {
    private demo: DemoInterface;
    private longitude: number;
    private latitude: number
    constructor(demo: DemoInterface) {
        this.demo = demo
        this.latitude = Math.random()*MAX_LATITUDE*2-MAX_LATITUDE
        this.longitude = Math.random()*MAX_LONGITUDE*2-MAX_LONGITUDE
    }
    private generateDriver() {
        const name = faker.person.fullName()
        const car_model = faker.vehicle.model()
        const car_color = faker.color.human()
        const license_plate = faker.vehicle.vrm()
        const {latitude, longitude} = this.generateCoordinate()
        return {name, car_model, car_color, license_plate, latitude, longitude}
    }
    private async moveDriver(driver_id: string, distance: number, angle: number) {
        const result = await this.demo.getLocation(driver_id);
        if (result) {
            const {latitude, longitude} = computeDestinationPoint({latitude: result.latitude, longitude: result.longitude}, distance, angle)

            // console.log("Moved driver", driver_id, "from", result.longitude, result.latitude, "to", longitude, latitude)
            await this.demo.setLocation(driver_id, latitude, longitude);
        }
    }
    private async simulateDriver() {
        const {name, car_model, car_color, license_plate, latitude, longitude} = this.generateDriver()
        const id = await this.demo.addDriver(name, car_model, car_color, license_plate)
        await this.demo.setLocation(id, latitude, longitude)
        // console.log("Added driver", id, name, car_model, car_color, license_plate, "at", longitude, latitude)

        let speed = Math.random()*17;
        let angle = Math.random()*80-40

        setInterval(() => {
            this.moveDriver(id, speed, angle);
        },1000)

        setInterval(() => {
            speed = Math.random()*17;
            angle = Math.random()*80-40
        }, 10000)
    }
    public generateCoordinate() {
        const distance = Math.random()*MAX_DISTANCE
        const angle = Math.random()*360
        return computeDestinationPoint({latitude: this.latitude, longitude: this.longitude}, distance*1000, angle)
    }
    public async getNearestDriver(latitude: number, longitude: number) {
        return await this.demo.getNearestDriver(latitude, longitude)
    }
    public run() {
        const NUM_DRIVERS = 1000;
        for (let i = 0; i < NUM_DRIVERS; i++) {
            this.simulateDriver()
        }
    }
}

export default Simulator;