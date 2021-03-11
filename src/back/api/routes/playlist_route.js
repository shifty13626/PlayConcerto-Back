const express = require('express');
const router = express.Router();
const dbManager = require('../../models/dbManager')
const playlist_entity = require('../../entities/playlist')
const playlist_model = require('../../models/playlist')

module.exports = (config) => {

    router.post('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let playlist = new playlist_entity.Playlist(req.body.name, req.body.id_genre);
        playlist_model.InsertPlaylist(connection, playlist);
    });

    router.get('/', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        if(req.query.name != null ){
            // ex : "/playlist?name=toto"
            let playlists = playlist_model.GetPlaylistByName(connection,req.query.name);
            playlists.then(function(result){
                console.log(result);
            })
        }else{
            let playlists = playlist_model.GetAllPlaylists(connection)
            playlists.then(function(result){
                console.log(result);
            })
        }
    });

    router.get('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let playlists = playlist_model.GetPlaylistById(connection,req.params.id)
        playlists.then(function(result){
            console.log(result);
        })
    });

    router.get('/:id/track/:name', (req, res) => {
        console.log("playlist GET /:id/track/:name => id = "+req.params.id+" et name = "+req.params.name);
    });

    router.put('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        let new_playlist = new playlist_entity.Playlist(req.body.name, req.body.id_genre);
        playlist_model.UpdatePlaylist(connection, req.params.id, new_playlist);
    });

    router.delete('/:id', (req, res) => {
        let connection = dbManager.OpenConnection(config);
        playlist_model.DeletePlaylist(connection, req.params.id);
    });

    return router;
};