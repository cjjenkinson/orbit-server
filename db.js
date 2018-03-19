const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/orbit-database')
  .then(() => {
    console.log('Connected to Orbits database');
  })
  .catch(err => {
    console.log('Cannot connect, wrong path');
  })
