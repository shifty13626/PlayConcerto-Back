const express = require('express');
const router = express.Router();

const user_route = require('../api/routes/user_route');
const track_route = require('../api/routes/track_route');
const artist_route = require('../api/routes/artist_route');
const playlist_route = require('../api/routes/playlist_route');


module.exports = (config) => {
  console.log("config from api/index.js :" + config)
  router.use('/user',user_route(config));
  router.use('/track',track_route(config));
  router.use('/artist',artist_route(config));
  router.use('/playlist',playlist_route(config));
  return router;
};
