const User = require("../models/user");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const config = require('../utils/config');
const recipe = require("../models/recipe");
const { request, response } = require("../app");
const userController = {

    register : async(request,response) => {
        try{
            // get the user input from request body
            const {username,email,password,bio,location} = request.body
            
            // check if user already exists in database
            const user = await User.findOne({email})
            // if user exists return an error
            if(user){
              return  response.status(400).json({message : "user already exists"})
            }
             // check if username already exists in database
             const userNameExist = await User.findOne({username})
             // if username exists,ask user to try with a different username
             if(userNameExist){
               return  response.status(400).json({message : "This name is already taken by a user,try using a different name"})
             }
             // hash the password (using bcrypt)
             const passwordHash = await bcrypt.hash(password,10)

            // if user doesnot exist , create a user
            // creating a newUser
            const newUser = new User({
                username,
                email,
                passwordHash,
                bio,
                location
            })
            
            // save the user to db
            const savedUser =await newUser.save()

            // send the response
            response.status(201).json({message : "Created successfully",user: savedUser})
        } catch(error){
            response.status(500).json({message : error.message});
        }
    },
    login : async(request,response)=>{
        try{
            // get the username from request body
            const {username,password} = request.body

            // check if the user exists in db
            const user = await User.findOne({username})

            // if the user doesn't exist return an error
            if(!user){
                 return response.status(400).json({message : "user not found"})
            }

            // if user exists, check the password if correct
            const isPasswordCorrect = await bcrypt.compare(password,user.passwordHash)

            // if the password is incorrect,return an error
            if(!isPasswordCorrect){
                return response.status(400).json({message : "Invalid credentials"})
            }

            // if the password is correct, generate a token for the user and return it
            const token = jwt.sign({
                username : user.username,
                id : user._id,
                email : user.email
            },config.JWT_SECRET)

            // set a cookie with token
            // response.cookie('token',token,{
            //     // httpOnly : true,
            //     // sameSite : 'none',
            //     expires : new Date(Date.now() + 24 * 60 * 60 * 1000), //24 hrs from now
            //     // secure :true //enable 
            // })

            // return the response 
            response.json({message : "Login Successful" , token})
        }
        catch(error){
            response.status(500).json({message : error.message})
        }
    },
    getUser : async(request,response) =>{
        try{
            // get the user id from the request object
            const userId = await request.userId
            // find the user by id from db
            const user = await User.findById(userId).select('-passwordHash -__v -_id')

            // if the user does not exist,return an error
            if(!user){
                return response.status(404).json({message : "User not found"})
            }
            // if user exists, return the user
            response.json({message : "User found",user})
        }catch(error){
            response.status(500).json({message : error.message})
        }
    },
    updateUser : async(request,response)=>{
        try {
            // get the user by request.userId
            let user = await User.findById(request.userId)

            //if user does not exist, return an error
            if(!user){
                return response.status(404).json({message : "User not found"})
            }

            // if user exists take data from request body
            const {username,email,bio,location} = request.body
            // update the data
            if(username)user.username=username
            if(email)user.email=email
            if(bio)user.bio = bio
            if(location)user.location = location

            // save to db
            const updatedUser = await user.save()

            // return the updated user
            response.status(200).json({message : "user successfully updated", user : updatedUser})
        } catch(error){
            response.status(500).json({message : error.message})
        }
    },
    deleteUser : async(request,response) => {
        try{
            // clear the token cookie
            response.clearCookie('token');

            // get the user id from request object
            const userId = await request.userId

            // check if user id exists
            const user = await User.findById(userId)

            // if user does not exist return error
            if(!user){
                response.status(404).json({message : "User doesn't exist"})
            } 

            // if user exists , delete the user
             await User.findByIdAndDelete(userId)

            // return the response
            response.json({message : "deleted the user successfully "})
        }catch(error){
            response.status(500).json({message : error.message})
        }
    },
    createRecipe : async(request,response) =>{
        try{
            // get the data from request body
            const  {name,ingredients,img,steps,cookingTips,cuisine,type,rating,likes} = request.body

            // check if the recipe name doesnot exist
            const exist = await recipe.findOne({name})
            if(exist){
                return response.status(400).json({message : "A recipe with this name already exists, try with a different name"})
            }
            // create a new recipe
            const newRecipe = new recipe({
                name,
                ingredients,
                img,
                steps,
                cookingTips,
                cuisine,
                type,
                rating,
                likes,
                createdBy : request.userId
            })

            // save the recipe to db
            await newRecipe.save()

            // send the response 
            response.status(201).json({message : "Recipe added successfully",recipe : newRecipe})

        } catch(error){
            response.status(500).json({message : error.message})
        }
    }, 
    getRecipe : async(request,response) =>{
        try{

            // check if this user has created any recipes
            const allRecipes = await recipe.find()
            
            // send the response 
            response.status(201).json({message : "Recipe added successfully",recipe : allRecipes})

        } catch(error){
            response.status(500).json({message : error.message})
        }
    },
    getMyRecipes : async(request,response) =>{
        try{
            
            let userId = request.userId
            // get all the recipes
            const allRecipes = await recipe.find({createdBy : userId})
            // filter by this user
            const userRecipes = allRecipes.filter(e => e.createdBy.valueOf() == userId)
            // check if this user has created any recipes
            if(userRecipes.length ==0){
                return response.status(400).json({message : "No Recipes uploaded by you"})
            }
            // send the response 
            response.status(201).json({message : "Recipe added successfully",recipe : userRecipes})

        } catch(error){
            response.status(500).json({message : error.message})
        }
    },
    updateRecipe : async(request,response) => {
        try{
            // get the id from request.params
            const {id}  = request.params
            const updateRecipe = await recipe.findById(id)
            console.log(updateRecipe)
            if(!updateRecipe) {
                return response.status(400).json({message : "recipe not found"})
            }

            // get the user id from request object
            const userId = request.userId

            const userIdfromRecipe = updateRecipe.createdBy.valueOf()
            console.log(userId,userIdfromRecipe)
            // check if this recipe created by this user
            if(!(userId == userIdfromRecipe)){
                return response.status(400).json("This operation cannot be done")
            }
            
            // get the data from req.body
            const {name,ingredients,img,steps,cookingTips,cuisine,type}  =  request.body

            // update the data
            if(name) updateRecipe.name = name
            if(ingredients) updateRecipe.ingredients = ingredients
            if(img) updateRecipe.img = img
            if(steps) updateRecipe.steps = steps
            if(cookingTips) updateRecipe.cookingTips = cookingTips
            if(cuisine) updateRecipe.cuisine = cuisine
            if(type) updateRecipe.type = type

            // save the updated data to the database
            const updatedData = await updateRecipe.save()

            // return the updated user
            response.json({ message: 'changes updated successfully', recipe : updatedData });

        } catch(error){
            response.status(500).json({message : error.message})
        }
        
    },
    addRating_Comment : async(request,response) => {
        try{
            // get the id from request.params
            const {id}  = request.params
            // get ratings from db
            let myrecipe = await recipe.findById(id)

            // get the user id from request object
            const userId = request.userId

            // get the data from req.body
            const {ratings,user,comment}  =  request.body
            var comments = {user:user,comment:comment}
            // myrecipe.rating = (rating+myrecipe.rating)/2
            myrecipe.comments.push(comments)
            myrecipe.rating = Math.round((myrecipe.rating + ratings)/2)

            // save the updated data to the database
            await myrecipe.save()
 
            // return the updated user
            response.json({ message: 'changes updated successfully' });

        } catch(error){
            response.status(500).json({message : error.message})
        }
        
    },
    deleteRecipe : async(request,response) => {
        try{
            // get the id from request.params
            const {id}  = request.params
            console.log(id)
            const RecipeToDelete = await recipe.findById(id)
            if(!RecipeToDelete) {
                return response.status(400).json({message : "recipe not found"})
            }

            // get the user id from request object
            const userId = request.userId

            const userIdfromRecipe = RecipeToDelete.createdBy.valueOf()
            console.log(userId,userIdfromRecipe)
            // check if this recipe created by this user
            if(!(userId == userIdfromRecipe)){
                return response.status(400).json("This operation cannot be done")
            }
            
            // remove the data
            await recipe.findByIdAndDelete(id)

            // return the updated user
            response.json({ message: 'Deleted successfully'});

        } catch(error){
            response.status(500).json({message : error.message})
        }
        
    },
    logout : async(request,response)=>{
        try{
            // clear the token cookie
            response.clearCookie('token');

            // return the response
            response.json({message : "Logged out successfully"})
            } catch(error){
                response.status(500).json({message : error.message})
            }
    }
}
// export the controller
module.exports = userController