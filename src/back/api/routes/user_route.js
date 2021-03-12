const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const user_entity = require('../../entities/user')
const user_model = require('../../models/user')

module.exports = (config) => {
    console.log("config from user_route.js : " +config)

    router.post('/', (req, res) => {
        console.log(config)
        let connection = dbManager.OpenConnection(config);
        console.log("hello")
        let user = new user_entity.User(req.body.pseudo, req.body.firstname,
            req.body.lastname, req.body.playlists);
        user_model.InsertUser(connection, user);
        console.log("user POST /");
    });

    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);

        if(req.query.pseudo != null ){
            // ex : "/user?pseudo=toto"
            let users = user_model.GetUserByPseudo(connection,req.query.pseudo);
            users.then(function(result){
                console.log("user GET/ by pseudo :"+req.query.pseudo)
                console.log(result);
            })
        }else {
            let users = user_model.GetAllUsers(connection)
            users.then(function (result) {
                console.log(result);
            })
            console.log("user GET /");
        }
    });

    router.get('/:id', (req, res) => {
        console.log("user GET /:id => id = "+req.params.id);
        let connection = dbManager.OpenConnection(config);
        let users = user_model.GetUserById(connection, req.params.id);
        users.then(function(result){
            console.log(result);
        })
    });

    router.get('/:id/playlist/', (req, res) => {
        console.log("user GET /:id/playlist => id = "+req.params.id);
        let connection = dbManager.OpenConnection(config);
        let playlists = user_model.GetAllUserPlaylists(connection, req.params.id);
        playlists.then(function(result){
            console.log(result);
        })
    });

    router.get('/:id/playlist/:name', (req, res) => {
        console.log("user GET /:id/playlist/:name => id = "+req.params.id+" et name = "+req.params.name);
        let connection = dbManager.OpenConnection(config);
        let playlist = user_model.GetUserPlaylistById(connection, req.params.id, req.params.name);
        playlist.then(function(result){
            console.log(result);
        })
    });

    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_user = new user_entity.User(req.body.pseudo, req.body.firstname,
            req.body.lastname, req.body.playlists)
        user_model.UpdateUser(connection, req.params.id, new_user);
        console.log("user PUT /:id => id = "+req.params.id);
    });

    router.delete('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        user_model.DeleteUser(connection, req.params.id);
        console.log("user DELETE /:id => id = "+req.params.id);
    });

    return router;
};