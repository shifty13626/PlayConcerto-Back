const express = require('express');
const router = express.Router();

module.exports = () => {

    router.get('/', (req, res) => {
        console.log("artist GET /");
    });

    router.get('/:id', (req, res) => {
        console.log("artist GET /"+req.params.id);
    });

    router.delete('/:id', (req, res) => {
        console.log("artist DELETE /"+req.params.id);
    });

    router.post('/', (req, res) => {
        console.log("artist POST /");
    });

    return router;
};