# Backend Application Repository

This repository contains the backend application for the Recipe Sharing App.For [Frontend Application Repository](front end link to be updated).

Backend application is a RESTful API built with Node.js and Express.js. It uses MongoDB as the database.

## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Create a `.env` file in the root directory and add the following environment variables:
   - `MONGODB_URI`: MongoDB connection string
   - `PORT`: Port number for the server
4. Run `npm run dev` to start the server

## Application

Recipe Sharing Application

## Features

  - [x] User registration
  - [x] User login
  - [x] View All Recipes
  - [x] View only their Recipes 
  - [x] Create Recipe
  - [x] Edit Recipe
  - [x] Delete Recipe
  - [x] View Profile
  - [x] Update Profile
  - [x] Delete Profile
  - [x] Logout

## API Endpoints

### Users

- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Login a user
- `GET /api/users/profile`: Get the user profile
- `PUT /api/users/profile`: Update the user profile
- `DELETE /api/users/profile`: Delete the user profile
- `POST /api/recipes`: Add a recipe
- `GET /api/recipes`: Get all recipes of the user
- `GET /api/recipes/all`: Get all the recipes
- `PUT /api/recipes/update`: Update the recipe
- `DELETE /api/users/profile`: Delete the user profile
- `GET /api/users/logout`: Logout the user

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Libraries Used

- mongoose: MongoDB object modeling tool. It is used to interact with MongoDB database. We use this instead of mongodb driver because it provides a simple schema-based solution to model our application data.