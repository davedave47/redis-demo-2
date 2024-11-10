import Simulator from "./Simulator"
import express, {Request, Response} from "express"
import cookieParser from "cookie-parser"
import RedisDemo from "./RedisDemo"
import PostGISDemo from "./PostGisDemo"
const PORT = 3000

const app = express()
const simulator = new Simulator(new RedisDemo())

simulator.run()

app.use(cookieParser())

app.get("/", (req: Request, res: Response) => {
    const {latitude, longitude} = simulator.generateCoordinate()
    res.cookie("latitude", latitude, { httpOnly: true, maxAge: 3600 * 1000 });
    res.cookie("longitude", longitude, { httpOnly: true, maxAge: 3600 * 1000 });
    res.json("Location added to cookies")
})

app.get("/nearest", async (req: Request, res: Response): Promise<any> => {
    const startTime = Date.now()
    let {latitude, longitude} = req.cookies;
    if (!latitude || !longitude) {
        ({latitude, longitude} = simulator.generateCoordinate())
        res.cookie("latitude", latitude, { httpOnly: true, maxAge: 3600 * 1000 });
        res.cookie("longitude", longitude, { httpOnly: true, maxAge: 3600 * 1000 });
    }
    const driver = await simulator.getNearestDriver(parseFloat(latitude.toString()), parseFloat(longitude.toString()))
    const time = Date.now() - startTime
    return res.status(200).json({
        time: `${time} ms`,
        ...driver
    })
})

app.listen(PORT, () => {
    console.log("app is listening on port:", PORT)
})
