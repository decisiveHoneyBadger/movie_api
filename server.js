const express = require ('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

app.use(bodyParser.json());

let users = [ 
    {
        id: 1,
        name: 'Kim',
        favoriteMovies: []
    },
    {
        id: 2,
        name: 'Joe',
        favoriteMovies: ['Taxi Driver']
    },
]

let movies = [ 
    {
        "Title": "Taxi Driver",
        "Plot":"A mentally unstable veteran works as a nighttime taxi driver in New York City, where the perceived decadence and sleaze fuels his urge for violent action.",
        "Genre": {
            "Name": "Drama",
            "Description":""
        },
       "Director": {
           "Name": "Martin Scorsese",
           "Bio": "Martin Scorsese is known for his gritty, meticulous filmmaking style and is widely considered one of the most important directors of all time. Scorsese's passion for films started at a young age, as he was an 8-year-old, pint-sized filmmaker. In 1968, he completed his first feature-length film, Who's That Knocking at My Door?, but it wasn't until he released Taxi Driver nearly 10 years later that he skyrocketed to fame for his raw formula of storytelling. He proved that the film wasn't a fluke with a lengthy string of successes that included Raging Bull, Goodfellas, The Departed, Hugo and The Irishman.",
           "Born": "1942",
           "Death": ""
       },
       "ImageURL": "https://upload.wikimedia.org/wikipedia/commons/4/43/Martin_Scorsese_Tribeca_2007_Shankbone.jpg",
       "Featured": "" 
    },
    {
        "Title": "Donnie Darko",
        "Plot":"",
        "Genre": {
            "Name": "Mystery",
            "Description": "lorem ipsum"
        },
       "Director": {
           "Name": "Richard Kelly",
           "Bio": "After narrowly escaping a bizarre accident, a troubled teenager is plagued by visions of a man in a large rabbit suit who manipulates him to commit a series of crimes.",
           "Born": "1975",
           "Death": ""
       },
       "ImageURL": "https://www.themoviedb.org/t/p/original/l0rWmZW2tBBwjBedjzAH23eagZ3.jpg",
       "Featured": "" 
    },
    {
        "Title": "Dr. Strangelove or: How I learned to Stop Worrying and Love the Bomb",
        "Plot":"An insane American general orders a bombing attack on the Soviet Union, triggering a path to nuclear holocaust that a war room full of politicians and generals frantically tries to stop.",
        "Genre": {
            "Name": "Comedy",
            "Description": "lorem ipsum"
        },
       "Director": {
           "Name": "Stanley Kubrick",
           "Bio": "Stanley Kubrick was an American film director, producer, screenwriter, and photographer. He is frequently cited as one of the greatest filmmakers in cinematic history. His films, almost all of which are adaptations of novels or short stories, cover a wide range of genres and are noted for their realism, dark humor, unique cinematography, extensive set designs, and evocative use of music.",
           "Born": "1928",
           "Death": "1999 "
       },
       "ImageURL": "https://www.themoviedb.org/t/p/original/yFT0VyIelI9aegZrsAwOG5iVP4v.jpg",
       "Featured": "" 
    },
];


// CREATE - adds new users and displays it afterwards 
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})

// CREATE - enables users to add any movie to their favorite list
app.post('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;
   
    let user = users.find (user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`$(movieName) has been added to user $(id)'s array`);
    } else {
        res.status(400).send('no such user')
    }
});

// READ - returns a list of all movies available
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// READ - returns the movies based on the searched title 
app.get('/movies/:title', (req, res) => {
    const {title} = req.params;
    const movie = movies.find(movie => movie.Title === title ) 

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie');
    }
})

// READ - returns the genre of a movie (based on the given genre)
app.get('/movies/genre/:genreName', (req, res) => {
    const {genreName} = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre

    if (genre) {
        res.status(200).json(genre);
    } else {  
        res.status(400).send('no such genre');
    }
})

// READ - returns additional information about the director based on its name 
app.get('/movies/directors/:directorName', (req, res) => {
    const {directorName} = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such genre');
    }
})



// UPDATE - updates user name by given user id
app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const updatedUser = req.body;
    let user = users.find (user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
});


// DELETE - compared to the code above, however, this code enables users to remove a movie from their list 
app.delete('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;
   
    let user = users.find (user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle); 
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
    } else {
        res.status(400).send('no such user')
    }
});

// DELETE - this code enables the user to delete his/her account (deregister)
app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
   
    let user = users.find (user => user.id == id);

    if (user) {
        users = users.filter ( user => user.id != id); 
        res.status(200).send(`${id} has been deleted`);; 
    } else {
        res.status(400).send('no such user')
    }
});





 



app.listen(8080, () => console.log('listening on 8080'));