import dotenv from "dotenv";
import morgan from "morgan";
import express from "express"


dotenv.config()


const app = express()
const PORT  = process.env.PORT

// logging middleware
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}


// body parser middleware
app.use(express.json({limit: '10kb'}))
app.use(express.urlencoded({extended: true, limit: "10kb"}))

// global error handler
app.use((err, req, res, next) => {
        console.log(err.status);
        res.status(err.status() || 500).json({
            status: "error",
            message: err.message || "Internal server error",
            ...(process.env.NODE_ENV === 'development' && {stack: err.stack} )
        })
       
})




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


