//entry point of backend
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import { app,server } from "./socket/socket.js";

//env config
dotenv.config({})

//port
const PORT = process.env.PORT || 3000


//creating a app var from express
// const app = express();


//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOptions))

//all api's will be here->
app.use("/api/v1/user",userRoute)
app.use("/api/v1/post",postRoute );
app.use("/api/v1/message",messageRoute );




server.listen(PORT, () => {
    connectDB()
    console.log(`Server is at port ${PORT}`)
})