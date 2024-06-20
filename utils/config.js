// importing doteenv
require('dotenv').config();

// creating necessary variables
const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET

// export the variables
module.exports = {MONGODB_URI,PORT,JWT_SECRET}