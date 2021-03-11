const express = require('express');
const router = express.Router();

const user = require('./routes/user_route');
const track = require('./routes/track_route');
const artist = require('./routes/artist_route');
const playlist = require('./routes/playlist_route');

module.exports = () => {
  router.use('/user',user());
  router.use('/track',track());
  router.use('/artist',artist());
  router.use('/playlist',playlist());
  return router;
};