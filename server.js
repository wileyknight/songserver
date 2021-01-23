const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');


dotenv.config({path: './config/config.env'});

// Route files
const songs = require('./routes/songs');

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// file upload
app.use(fileUpload({
    createParentPath: true
}));

// make public available
app.use(express.static(path.join(__dirname, 'public')));

// use cross origins
app.use(cors());


// Mount routers
app.use('/api/songs', songs);

// define the port
const PORT = process.env.PORT || 5000;

// server running
app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);