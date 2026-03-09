import mongoose from "mongoose";

const MAX_RETRIES = 3

const RETRY_INTERVAL = 5000 // 5 second

class DatabaseConnection {
    constructor() {
        this.retryCount = 0
        this.isConnected = false

        // configure 
        mongoose.set('strictQuery', true)

        mongoose.connection.on("connected", () => {
            console.log("MONGODB Connected successfully");
            this.isConnected = true

        })

        mongoose.connection.on("error", () => {
            console.log("MONGODB connection error ");
            this.isConnected = false
        })

        mongoose.connection.on("disconnected", () => {
            console.log("MONGODB  disconnected  ");
            this.isConnected = false
            //  TODO    : attempt a reconnction
        })
    }


    async connect() {
     try {
           if (!process.env.MONGO_URI) {
               throw new Error("MONGODB URI is not defined in env variables")
           }
   
           const connectionOptions = {
               useNewUrlParser: true,
               useUnifiedTopology: true,
               maxPoolSize: 10,
               serverSelectionTimeoutMS: 5000,
               socketTimeoutMS: 45000,
               family: 4 // use ipv4
           };
   
           if (process.env.NODE_ENV === 'development') {
               mongoose.set('debug', true)
           }
   
           await mongoose.connect(process.env.MONGO_URI, connectionOptions)
           this.retryCount = 0 // reset retry count on success
     } catch (error) {
        console.error(error.message);
        await this.handleConnectionError()
        
     }



    }

    async handleConnectionError() {
        if (this.retryCount < MAX_RETRIES) {
            this.retryCount++;
            console.log(`Retrying Connection... Attempt ${this.retryCount} of ${MAX_RETRIES}`);

            await new Promise(resolve => setTimeout(() => {
                resolve
            }, RETRY_INTERVAL))
            return this.connect()




        }
    }
}