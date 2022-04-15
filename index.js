// logging middleware library for Express via Morgan to log all requests
const express = require('express');
morgan = require('morgan');

const app = express();

app.use(morgan('common'));


let movies = [
  {
    title: '12 Monkeys',
    director: 'Terry Gilliam'
  },
  {
    title: 'Lord of the Rings',
    director: 'Peter Jackson'
  },
  {
    title: 'Tiger & Dragon',
    director: 'Ang Lee'
  },
  {
    title: 'Fight Club',
    director: 'David Fincher'
  },
  {
    title: 'Terminator 2',
    director: 'James Cameron'
  },
  {
    title: 'Falling Dawn',
    director: 'Joel Schumacher'
  },
  {
    title: 'Karate Tiger',
    director: 'Corey Yuen'
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino'
  },
  {
    title: 'Matrix',
    director: 'Wachowski Brothers'
  },
  {
    title: 'Requiem for a Dream',
    director: 'Darren Aronofsky'
  },
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to the movie_api!');
});

app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.json(movies);
})


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).send('page not found');
  });

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});