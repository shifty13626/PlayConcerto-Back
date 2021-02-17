const express = require('express');
const playlist = require('./routes/playlist');
const router = express.Router();
const models = require('../../models/index.js')

module.exports = () => {
    router.use('/playlist', playlist());


    return router;
};