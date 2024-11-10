interface DemoInterface{
    getDriver(driver_id: string): Promise<{name: string, car_model: string, car_color: string, license_plate: string}>;
    addDriver(name: string, car_model: string, car_color: string, license_plate: string): Promise<string>
    setLocation(driver_id: string, latitude: number, longitude: number): Promise<void>
    getLocation(driver_id: string): Promise<{latitude: number, longitude: number}|null>
    getNearestDriver(latitude: number, longitude: number): Promise<{distance: string, latitude: number, longitude: number, name: string, car_model: string, car_color: string, license_plate: string} | null>
}

export default DemoInterface;