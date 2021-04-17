const routes = require('../api');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PlayConcerto',
            version: '1.0.0',
        },
        tags: [
            {
                "name": "Artist",
                "description": "Operations on artist"
            },
            {
                "name": "Genre",
                "description": "Operations on genre"
            },
            {
                "name": "Playlist",
                "description": "Operations on playlist"
            },
            {
                "name": "Track",
                "description": "Operations on track"
            },
            {
                "name": "User",
                "description": "Operations on user"
            }
        ]
    },
    apis: [
        './api/**/*.js',
    ], // files containing annotations as above
};





module.exports = (app, config) => {

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*"); 
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
      next();
    });
    /**
     * Health Check endpoints
     */
    app.get('/status', (req, res) => {
      res.status(200).end();
    });
  
    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.json());
    // Load API routes
    app.use('/api', routes(config));

    const swaggerSpec = swaggerJsdoc(options);
    // Load swagger
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};