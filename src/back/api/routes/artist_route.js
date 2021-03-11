const express = require('express');
const router = express.Router();

module.exports = () => {

    router.post('/', (req, res) => {
        console.log("artist POST /");
    });

    router.get('/', (req, res) => {
        console.log("artist GET /");
    });

    router.get('/:id', (req, res) => {
        console.log("artist GET /:id => id = "+req.params.id);
    });

    router.get('/:name', (req, res) => {
        console.log("artist GET /:name => name = "+req.params.name);
    });

    router.get('/:id/track/:name', (req, res) => {
        console.log("artist GET /:id/track/:name => id = "+req.params.id+" et name = "+req.params.name);
    });

    router.put('/:id', (req, res) => {
        console.log("artist PUT /:id => id = "+req.params.id);
    });

    router.delete('/:id', (req, res) => {
        console.log("artist DELETE /:id => id = "+req.params.id);
    });

    return router;
};