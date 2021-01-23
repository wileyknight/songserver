const express = require('express');
const {
  getSongs,
  createSong,
  createSongs
} = require('../controllers/songs');

const {getSongsList} = require('../middleware/getsongslist');

const router = express.Router();

router
  .route('/')
  .get(getSongsList, getSongs)
  .post(getSongsList, createSong);

  router
  .route('/csv')
  .post(getSongsList, createSongs);

module.exports = router;