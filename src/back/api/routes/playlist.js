const express = require('express');
const router = express.Router();

module.exports = () => {

    router.get('/', (req, res) => {
        console.log("playlist GET /");
    });

    router.get('/:id', (req, res) => {
        console.log("playlist GET /"+req.params.id);
    });

    router.delete('/:id', (req, res) => {
        console.log("playlist DELETE /"+req.params.id);
    });

    router.post('/', (req, res) => {
        console.log("playlist POST /");
    });

    return router;
};