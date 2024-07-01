// import or require express
const express = require("express")
const userRouter = require("./routes/userRoutes")

// require cors
const cors = require('cors')

const cookieParser = require("cookie-parser")

// create an express appn
const app = express()

//enable all cors requests
app.use(cors({
    origin : '*',//allow all origins
    credentials:true
})) 

// use cookie parser
app.use(cookieParser());

// enable the express application to parse json
app.use(express.json())

// define the endpoints
app.use('/api/users',userRouter)
app.get('/',(req,res)=>{res.send("welcome!!")})

// export the app module
module.exports = app