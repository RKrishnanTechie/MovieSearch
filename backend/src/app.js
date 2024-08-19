import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,// This allows the server to accept cookies from the frontend
}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes import 
import userRouter from "./routes/user.route.js"
import favoriteRouter from './routes/favorite.route.js';
import movieRouter from './routes/movie.route.js';
import reviewRoutes from './routes/review.route.js';



//routes declaration
app.use("/users", userRouter)
app.use('/favorites', favoriteRouter);
app.use('/movies', movieRouter);
app.use('/reviews', reviewRoutes);

export { app }