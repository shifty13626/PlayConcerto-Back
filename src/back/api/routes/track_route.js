const express = require('express');
const router = express.Router();

module.exports = () => {

    router.get('/', (req, res) => {
        console.log("track GET /");
    });

    router.get('/:id', (req, res) => {
        console.log("track GET /"+req.params.id);
    });

    router.delete('/:id', (req, res) => {
        console.log("track DELETE /"+req.params.id);
    });

    router.post('/', (req, res) => {
        console.log("track POST /");
    });

    return router;
};
