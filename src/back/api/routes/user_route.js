const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const user_entity = require('../../entities/user')
const user_model = require('../../models/user')
const bcrypt = require('bcrypt')

module.exports = (config) => {
    console.log("config from user_route.js : " +config);

    /**
     * @swagger
     *
     * /user/auth:
     *   post:
     *     description: to save a new user
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: firstname
     *         in: body
     *         required: true
     *         type: string
     *       - name: lastname
     *         in: body
     *         required: true
     *         type: string
     *       - name: pseudo
     *         in: body
     *         required: true
     *         type: string
     *       - name: password
     *         in: body
     *         required: true
     *         type: string
     *      responses:
     *           "200":
     *           description: id : {user_id}
     *           "400":
     *           description: User ${user.id} cannot be created. Pseudo is mandatory.
     *           "500":
     *           description: {error} error message.
     */
    // Route to add a user
     router.post('/', async (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        let user = new user_entity.User(null, req.body.pseudo, hashedPassword, req.body.firstname, req.body.lastname);
        user_model.InsertUser(connection, user).then((user_created) => {
            if (user_created.affectedRows !== 0) {
                res.status(200).send({'id' : user_created.insertId});
            }
            else {
                res.status(400).send(`User ${user.id} cannot be created. Pseudo is mandatory.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        });
        connection.end();
    });

    /**
     * @swagger
     *
     * /user/auth:
     *   post:
     *     description: Check authentification of user.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: pseudo
     *         in: body
     *         required: true
     *         type: string
     *       - name: password
     *         in: body
     *         required: true
     *         type: string
     *      responses:
     *           "200":
     *           description: id : {user_id}
     *           "400":
     *           description: User ${user.pseudo} not found.
     *           "500":
     *           description: {error} error message.
     */
    //User get authentication
    router.post('/auth',  (req, res) => {
        let connection = dbManager.OpenConnection(config);
        user_model.GetUserByPseudo(connection, req.body.pseudo).then( async (user) => {
            if (user !== null){
                const comparison = await bcrypt.compare(req.body.password, user[0].password);
                if(comparison){
                    res.status(200).send({'id': user[0].id_user});
                }
                else{
                    res.status(200).send(null);
                }
            } else {
                res.status(400).send(`User ${req.body.pseudo} not found.`);
            }
        }).catch( (error) => {
            res.status(500).send(error);
        })
    })

    /**
     * @swagger
     *
     * /user/:
     *   get:
     *     description: Get user by pseudo.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: pseudo
     *         in: body
     *         required: true
     *         type: string
     *      responses:
     *           "200":
     *           description: id : {user}
     *           "400":
     *           description: User ${user.pseudo} does not exist.
     *           "500":
     *           description: {error} error message.
     */
    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        if(req.query.pseudo != null ){
            // ex : "/user?pseudo=toto"
            user_model.GetUserByPseudo(connection,req.query.pseudo).then((user) => {
                if (user !== null) {
                    res.status(200).send(user[0]);
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
                if (users !== null) {
                    res.status(200).send(users);
                } else {
                    res.status(400).send('No users at all in the database.');
                }
            }).catch((error) => {
                res.status(500).send(error);
            });
        }
        connection.end();
    });

    /**
     * @swagger
     *
     * /user/:id:
     *   get:
     *     description: Get user by id.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         type: string
     *      responses:
     *           "200":
     *           description: {user}
     *           "400":
     *           description: User ${user.id} not found.
     *           "500":
     *           description: {error} error message.
     */
    router.get('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        user_model.GetUserById(connection, req.params.id).then((user) => {
            if (user !== null) {
                res.status(200).send(user[0]);
            }
            else {
                res.status(400).send(`User ${req.params.id} not found.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        });
        connection.end();
    });

    /**
     * @swagger
     *
     * /user/:id/playlist:
     *   get:
     *     description: Get all playlist for user identified by his id.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         type: string
     *      responses:
     *           "200":
     *           description: {playlist[]}
     *           "400":
     *           description: User ${user.id} does not have playlist yet.
     *           "500":
     *           description: {error} error message.
     */
    router.get('/:id/playlist/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        user_model.GetAllUserPlaylists(connection, req.params.id).then((playlists) => {
            if (playlists !== null) {
                res.status(200).send(playlists);
            }
            else {
                res.status(400).send(`User ${req.params.id} does not have playlist yet.`)
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    /**
     * @swagger
     *
     * /user/:id/playlist/:name:
     *   get:
     *     description: Get playlist identified by his name for a user identified by his id.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         type: string
     *      - name: name
     *         in: path
     *         required: true
     *         type: string
     *      responses:
     *           "200":
     *           description: {playlist
     *           "400":
     *           description: User ${user.id} does not have playlist {playlist.name}.
     *           "500":
     *           description: {error} error message.
     */
    router.get('/:id/playlist/:name', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        user_model.GetUserPlaylistById(connection, req.params.id, req.params.name).then((playlist) => {
            if (playlist !== null) {
                res.status(200).send(playlist[0]);
            }
            else {
                res.status(400).send(`User ${req.params.id} does not have playlist ${req.params.name}.`)
            }
        }).catch((error) => {
            res.status(500).send(error);
        });
        connection.end();
    });

    /**
     * @swagger
     *
     * /user/:id/:
     *   get:
     *     description: Update user information.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         type: string
     *      - name: psuedo
     *         in: body
     *         required: true
     *         type: string
 *          - name: firstname
     *         in: body
     *         required: true
     *         type: string
     *     - name: lastname
     *         in: body
     *         required: true
     *         type: string
*           - name: paswword
     *         in: body
     *         required: true
     *         type: string
     */
    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_user = new user_entity.User(req.body.pseudo, req.body.firstname,
            req.body.lastname, req.body.body.password);
        user_model.UpdateUser(connection, req.params.id, new_user);
        console.log("user PUT /:id => id = "+req.params.id);
        connection.end();
    });

    /**
     * @swagger
     *
     * /user/:id/:
     *   get:
     *     description: To delete an user.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         type: string
     *      responses:
     *           "200":
     *           description: User {user.id} has been deleted.}
     *           "400":
     *           description: User ${user.id} not found. Can not delete it.
     *           "500":
     *           description: {error} error message.
     */
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
