const express = require('express');
const router = express.Router();

module.exports = () => {

    router.get('/', (req, res) => {
        console.log("user GET /");
    });

    router.get('/:id', (req, res) => {
        console.log("user GET /"+req.params.id);
    });

    router.delete('/:id', (req, res) => {
        console.log("user DELETE /"+req.params.id);
    });

    router.post('/', (req, res) => {
        console.log("user POST /");
    });

    return router;
};