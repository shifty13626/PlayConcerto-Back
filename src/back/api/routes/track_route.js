const express = require('express');
const router = express.Router();

module.exports = (config) => {

    router.post('/', (req, res) => {
        console.log("track POST /");
    });

    router.get('/', (req, res) => {
        console.log("track GET /");
    });

    router.get('/:id', (req, res) => {
        console.log("track GET /:id => id = "+req.params.id);
    });

    router.get('/:name', (req, res) => {
        console.log("track GET /:name => name = "+req.params.name);
    });

    router.get('/:id/artist/:name', (req, res) => {
        console.log("track GET /:id/artist/:name => id = "+req.params.id+" et name = "+req.params.name);
    });

    router.put('/:id', (req, res) => {
        console.log("track PUT /:id => id = "+req.params.id);
    });

    router.delete('/:id', (req, res) => {
        console.log("track DELETE /:id => id = "+req.params.id);
    });

    return router;
};
