import dotenv from "dotenv";
import morgan from "morgan";
import express from "express"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from "cors"
import healthRoute from "./routes/health.route.js"


dotenv.config()


const app = express()
const PORT = process.env.PORT


// global rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
})

// security middleware
app.use(helmet())
app.use(mongoSanitize())
app.use(hpp())
app.use("/api", limiter)
app.use(cookieParser())


// cors configuration

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],

    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "device-remember-token",
        "Access-Control-Allow-origin",
        "Origin",
        "Accept",
    ]
}))



// logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}


// body parser middleware
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))

// global error handler
app.use((err, req, res, next) => {
    console.log(err.status);
    res.status(err.status() || 500).json({
        status: "error",
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })

})


// API Routes
app.use("/health", healthRoute)






// it should be at a bottom
// 404 handler

app.use((req, res) => {
    res.json(404).json({
        status: "error",
        message: "route not found"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} in ${process.env.NODE_ENV} mode`);
})


