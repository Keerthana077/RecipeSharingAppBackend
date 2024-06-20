// import Mongoose
const mongoose = require('mongoose')
const app = require('./app')
// import config
const config = require('./utils/config')

console.log("Connecting to DB....")

mongoose.connect(config.MONGODB_URI)
    .then(()=>{
        console.log('Connected to DB')
        // writing here bcoz if there is any connection issue server shouldn't be started
        // listen to port
        app.listen(config.PORT,()=>{
            console.log(`Server Started at ${config.PORT}`)
        })
    })
    .catch((error)=>{
        console.log("Error",error.message)
    })


