const mongoose = require('mongoose')

// create schema
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required :  true
    },
    email : {
        type : String,
        required :  true
    },
    passwordHash : String,
    bio : String,
    location : {
        type : String,
        default : 'unknown'
    },
    role : {
        type : String,
        enum : ['user','admin'],
        default : 'user'

    }
})

// create a model and export it
// Users => modelName, userSchema => schemaName , users => collectionName
module.exports = mongoose.model('User',userSchema,'users')