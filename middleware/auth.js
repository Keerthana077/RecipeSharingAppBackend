const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../utils/config')
const auth = {
    verifyToken : (request,response,next)=>{
        try{
            // get the token from request cookies
            const token = request.headers.token

            // if the token doesn't exists, return an error
            if(!token){
                return response.status(401).json({message : "Unauthorized"})
            }

            // verify the token
            try{
                
                const decodedToken = jwt.verify(token,JWT_SECRET)
                // set the userId in request object
                request.userId = decodedToken.id

                // call the next middleware
                next()
            }catch(error){
                response.status(401).json({message : "Invalid Token"})
            }
        } catch(error){
            response.status(500).json({message : error.message})
        }
    }
}

// export the auth variable
module.exports = auth