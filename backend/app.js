const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();

const bodyParser = require('body-parser');

/* Connect to Mongodb Atlas */

mongoose.connect('mongodb+srv://successtar:SrhPVGOnjvqZbXBU@cluster0-oiozm.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use(bodyParser.json());

/* Allow cross origin */

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/* Create new Recipe endpoint handler */

app.post('/api/recipes', (req, res, next) => {

  const recipe = new Recipe({
    title: req.body.title,
    instructions: req.body.instructions,
    ingredients: req.body.ingredients,
    time: req.body.time,
    difficulty: req.body.difficulty
  });

  recipe.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

/* Load single recipe endpoint handler */

app.get('/api/recipes/:id', (req, res, next) => {

  Recipe.findOne({
    _id: req.params.id
  }).then(
    (recipe) => {
      res.status(200).json(recipe);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});

/* Update recipe endpoint handler */

app.put('/api/recipes/:id', (req, res, next) => {

  const recipe = new Recipe({
    _id: req.params.id,
    title: req.body.title,
    instructions: req.body.instructions,
    ingredients: req.body.ingredients,
    time: req.body.time,
    difficulty: req.body.difficulty
  });

  Recipe.updateOne({_id: req.params.id}, recipe).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

/* Delete recipe endpoint handler */

app.delete('/api/recipes/:id', (req, res, next) => {

  Recipe.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

/* Load all recipes endpoint handler */

app.use('/api/recipes', (req, res, next) => {

    Recipe.find().then(
    (recipe) => {
      res.status(200).json(recipe);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

module.exports = app;
