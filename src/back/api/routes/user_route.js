const express = require('express');
const router = express.Router();

module.exports = () => {

    router.post('/', (req, res) => {
        console.log("user POST /");
    });

    router.get('/', (req, res) => {
        console.log("user GET /");
    });

    router.get('/:id', (req, res) => {
        console.log("user GET /:id => id = "+req.params.id);
    });

    router.get('/:name', (req, res) => {
        console.log("user GET /:name => name = "+req.params.name);
    });

    router.get('/:id/playlist/', (req, res) => {
        console.log("user GET /:id/playlist => id = "+req.params.id);
    });

    router.get('/:id/playlist/:name', (req, res) => {
        console.log("user GET /:id/playlist/:name => id = "+req.params.id+" et name = "+req.params.name);
    });

    router.put('/:id', (req, res) => {
        console.log("user PUT /:id => id = "+req.params.id);
    });

    router.delete('/:id', (req, res) => {
        console.log("user DELETE /:id => id = "+req.params.id);
    });

    return router;
};