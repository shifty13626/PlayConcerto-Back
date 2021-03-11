const express = require('express');
const router = express.Router();

const user = require('./routes/user');
const track = require('./routes/track');
const artist = require('./routes/artist');
const playlist = require('./routes/playlist');

module.exports = () => {
  router.use('/user',user());
  router.use('/track',track());
  router.use('/artist',artist());
  router.use('/playlist',playlist());
  return router;
};