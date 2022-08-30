# movie_api

## Description

myFlix API is the server-side of a movies web application. The application provides users with access to information about different movies, their directors and the movie genre. Users are able to sign up, update their personal information, create a list of their favorite movies and remove movies from their favorite list.

## User stories

- As a user, I want to be able to receive information on movies, directors, and genres so that I can learn more about movies I’ve watched or am interested in.

- As a user, I want to be able to create a profile so I can save data about my favorite movies.

## :key: Features

- Returns a list of all movies to the user.

- Returns data (description, genre, director, image URL) about a single movie by title to the user.

- Return data about a genre (description) by name/title. (e.g., “Thriller”)

- Returns data about a director (bio) by name of the director.

- Allows new users to register.

- Allow users to update their user info (username, password, email, date of birth)

- Allow users to add a movie to their list of favorites.

- Allow users to remove a movie from their list of favorites.

- Allow existing users to unregister.

## Technologies

### :hammer_and_wrench: Built With

- JavaScript

- Node.js

- Express

- MongoDB

## :page_with_curl: Technical Requirements

- The API must be a Node.js and Express application.

- The API must use REST architecture, with URL endpoints corresponding to the data operations listed above.

- The API must use at least three middleware modules, such as the body-parser package for reading data from requests and morgan for logging.

- The API uses a [“package.json”](https://github.com/decisiveHoneyBadger/movie_api/blob/main/package.json) file.

- The database was built using MongoDB.

- The business logic was modeled with Mongoose.

- The API provides movie information in JSON format.

- The JavaScript code is error-free.

- The API was tested in Postman.

- The API includes user authentication and authorization code.

- The API includes data validation logic.

- The API meets data security regulations.

- The API source code was deployed to a publicly accessible platform like [GitHub].

- The API was deployed to [Heroku](https://www.heroku.com/).

## :man_technologist: Get Started

Download the repository on your machine

```
https://github.com/decisiveHoneyBadger/movie_api.git
```

Install dependencies

```
npm install
```

Install MongoDB

```
npm install mongodb
```

Start the server

```
node index.js
```

#### Endpoints tested with [Postman](https://www.postman.com/) :computer:

Documentation can be found here :point_down: https://github.com/decisiveHoneyBadger/movie_api/blob/main/public/documentation.html

#### Deployment to [Heroku](https://www.heroku.com/) :card_index_dividers:

#### Documentation with [JSDocs](https://jsdoc.app/) :memo:

## :rocket:
