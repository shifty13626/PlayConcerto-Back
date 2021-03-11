const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')

module.exports = (config) => {
    //console.log("dans route playlist");
    //console.log(config);

    router.post('/', (req, res) => {
        console.log("playlist POST /");
    });

    router.get('/', (req, res) => {
        //console.log("dans le GET");
        //console.log(config);
        let connection = dbManager.OpenConnection(config);
        console.log(dbManager.GetPlaylists(connection));

        console.log("playlist GET /");
    });

    router.get('/:id', (req, res) => {
        console.log("playlist GET /:id => id = "+req.params.id);
    });

    router.get('/:name', (req, res) => {
        console.log("playlist GET /:name => name = "+req.params.name);
    });

    router.get('/:id/track/:name', (req, res) => {
        console.log("playlist GET /:id/track/:name => id = "+req.params.id+" et name = "+req.params.name);
    });

    router.put('/:id', (req, res) => {
        console.log("playlist PUT /:id => id = "+req.params.id);
    });

    router.delete('/:id', (req, res) => {
        console.log("playlist DELETE /:id => id = "+req.params.id);
    });
    return router;
};