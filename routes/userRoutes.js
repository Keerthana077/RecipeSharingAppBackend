// import express
const express = require('express')
const userController = require('../controllers/UserController')
const auth = require('../middleware/auth')
const user = require('../models/user')

const userRouter =  express.Router()

// define the endpoints
// POST: register a new user
userRouter.post('/register',userController.register)
userRouter.post('/login',userController.login)

// protected routes
userRouter.get('/profile',auth.verifyToken,userController.getUser)
userRouter.put('/profile',auth.verifyToken,userController.updateUser)
userRouter.delete('/profile',auth.verifyToken,userController.deleteUser)

userRouter.post('/recipe',auth.verifyToken,userController.createRecipe)
userRouter.get('/allRecipes',auth.verifyToken,userController.getRecipe)
userRouter.get('/myRecipes',auth.verifyToken,userController.getMyRecipes)
userRouter.put('/recipe/:id',auth.verifyToken,userController.updateRecipe)
userRouter.delete('/recipe/:id',auth.verifyToken,userController.deleteRecipe)

userRouter.get('/logout',auth.verifyToken,userController.logout)
// export the router
module.exports = userRouter