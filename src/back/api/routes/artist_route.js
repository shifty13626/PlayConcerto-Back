const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const artist_entity = require('../../entities/artist')
const artist_model = require('../../models/artist')

module.exports = (config) => {

    // To create an artist
    /**
     * @openapi
     * /api/artist:
     *   post:
     *     description: Create a new artist object in database!
     *     tags :
     *       - Artist
     *     responses:
     *       200:
     *         description: {artist created}
     *       400:
     *         description: artist {artist.id} cannot be created, one or many parameters missing.
     *       500:
     *         description: {error}, message d'erreur venant du serveur.
     */
    router.post('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let artist = new artist_entity.Artist(req.body.name);
        artist_model.InsertArtist(connection, artist).then((artist_created) => {
            if (artist_created.affectedRows !== 0) {
                res.status(200).send(artist_created);
            }
            else {
                res.status(400).send(`Artist ${artist} cannot be created. Pseudo is mandatory.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        });
        connection.end();
    });

    // To get all artist
    /**
     * @openapi
     * /api/artist:
     *   get:
     *     description: Get all the artists in the database ! Or only one by name if there is a parameter.
     *     tracks:
     *       - Artist
     *     responses:
     *       200:
     *         description: {artists} All the artists found in the database, or the one searched with the parameter.
     *       400:
     *         description: No artist in database or the one searched is missing.
     *       500:
     *         description: {error}, message d'erreur venant du serveur.
     */
    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);

        if(req.query.name != null ){
            // ex : "/artist?name=toto"
            artist_model.GetArtistByName(connection,req.query.name).then( (artist) => {
                if(artist != null){
                    res.status(200).send(artist[0]);
                }
                else {
                    res.status(400).send(`Can not get ${artist.name}.`);
                }
            }).catch( (error) => {
                res.status(500).send(error);
            })
        }else{
            artist_model.GetAllArtists(connection).then( (artists) => {
                if(artists != null){
                    res.status(200).send(artists);
                }
                else {
                    res.status(400).send(`Can not get artists, there is none.`);
                }
            }).catch( (error) => {
                res.status(500).send(error);
            })
        }
        connection.end();
    });

    // Get artist identified by his id
    /**
     * @openapi
     * /api/artist/:id:
     *   get:
     *     description: Get one artist by id.
     *     tags:
     *       - Artist
     *     responses:
     *       200:
     *         description: {artist} Artist with id_artist equals id.
     *       400:
     *         description: No artist in database with this id.
     *       500:
     *         description: {error}, message d'erreur venant du serveur.
     */
    router.get('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        artist_model.GetArtistById(connection,req.params.id).then( (artist) => {
            if(artist != null){
                res.status(200).send(artist[0]);
            }
            else {
                res.status(400).send(`Can not get ${artist.name}.`);
            }
        }).catch( (error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    /**
     * @openapi
     * /api/artist/:id:
     *   put:
     *     description: Update one artist according to the id.
     *     tags:
     *       - Artist
     *     responses:
     *       200:
     *         description: {artist} new Artist with id_artist equals id.
     *       400:
     *         description: No artist in database with this id or missing parameters to artist.
     *       500:
     *         description: {error}, message d'erreur venant du serveur.
     */
    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_artist = new artist_entity.Artist(req.body.name);
        artist_model.UpdateArtist(connection, req.params.id, new_artist);
        connection.end();
    });

    // Delete artist identified by id
    /**
     * @openapi
     * /api/artist/:id:
     *   delete:
     *     description: Delete the artist with artist_id equals id.
     *     tags:
     *       - Artist
     *     responses:
     *       200:
     *         description: {artist deleted} The artist is deleted.
     *       400:
     *         description: No artist in database with this id.
     *       500:
     *         description: {error}, message d'erreur venant du serveur.
     */
    router.delete('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        artist_model.DeleteArtist(connection, req.params.id).then( (artist_deleted) => {
            if (artist_deleted['affectedRows'] !== 0) {
                res.status(200).send(`Artist ${req.params.id} has been deleted.`);
            }
            else {
                res.status(400).send(`Artist ${req.params.id} not found. Can not delete it.`);
            }
        }).catch((error) => {
            res.status(500).send(error);
        })
        connection.end();
    });

    return router;
};
