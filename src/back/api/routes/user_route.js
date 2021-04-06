const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const user_entity = require('../../entities/user')
const user_model = require('../../models/user')

module.exports = (config) => {
    console.log("config from user_route.js : " +config);

    // Route to add a user
    router.post('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let user = new user_entity.User(req.body.pseudo, req.body.firstname,
            req.body.lastname, req.body.playlists);
        user_model.InsertUser(connection, user).then((user_created) => {
            if (user_created['affectedRows'] !== 0) {
                res.status(200).send(`User ${user.pseudo} has been created.`);
            }
            else {
                res.status(400).send(`User ${user} cannot be created. Pseudo is mandatory.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        });
        connection.end();
    });

    
    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        if(req.query.pseudo != null ){
            // ex : "/user?pseudo=toto"
            user_model.GetUserByPseudo(connection,req.query.pseudo).then((user) => {
                if (user !== null) {
                    res.send(user);
                }
                else {
                    res.status(400).send(`User ${req.query.pseudo} does not exist.`)
                }
            }).catch((error) => {
                res.status(500).send(error);
            });
        }
        else {
            user_model.GetAllUsers(connection).then((users) => {
                res.send(users);
            }).catch((error) => {
                res.status(500).send(error);
            });
        }
        connection.end();
    });

    // Get user by id
    router.get('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        user_model.GetUserById(connection, req.params.id).then((user) => {
            if (user !== null) {
                res.send(user);
            }
            else {
                res.status(400).send(`User ${req.params.id} not found.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        });
        connection.end();
    });

    // Get user playlist by id user
    router.get('/:id/playlist/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        user_model.GetAllUserPlaylists(connection, req.params.id).then((playlists) => {
            if (playlists !== null) {
                res.send(playlists);
            }
            else {
                res.status(400).send(`User ${req.params.id} does not have playlist yet.`)
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    // Get playlist for an user idenitified by his id and name playlist
    router.get('/:id/playlist/:name', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        user_model.GetUserPlaylistById(connection, req.params.id, req.params.name).then((playlist) => {
            if (playlist !== null) {
                res.send(playlist);
            }
            else {
                res.status(400).send(`User ${req.params.id} does not have playlist ${req.params.name}.`)
            }
        }).catch((error) => {
            res.status(500).send(error);
        });
        connection.end();
    });

    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_user = new user_entity.User(req.body.pseudo, req.body.firstname,
            req.body.lastname, req.body.playlists)
        user_model.UpdateUser(connection, req.params.id, new_user);
        console.log("user PUT /:id => id = "+req.params.id);
        connection.end();
    });

    // To delete an user
    router.delete('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        user_model.DeleteUser(connection, req.params.id).then( (user_deleted) => {
            if (user_deleted['affectedRows'] !== 0) {
                res.status(200).send(`User ${req.params.id} has been deleted.`);
            }
            else {
                res.status(400).send(`User ${req.params.id} not found. Can not delete it.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    return router;
};
