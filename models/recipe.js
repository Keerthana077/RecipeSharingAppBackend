// require the mongoose
const mongoose = require('mongoose')

// create schema
const recipeSchema = mongoose.Schema({
    name : {
        type :  String,
        required :  true
    },
    ingredients : String,
    img : String,
    steps : String,
    cookingTips : String,
    cuisine : String,
    type : String,
    rating : {
        type : Number,
        default : 0
    },
    likes : {
        type : Number,
        default : 0
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})

// create model and export it
module.exports = mongoose.model('Recipe',recipeSchema,'recipes')