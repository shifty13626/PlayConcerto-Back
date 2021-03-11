class Playlist {
    constructor(name, id_genre, tracklist) {
        this.name = name;
        this.id_genre = id_genre;
        this.tracklist = tracklist;
    }
}

// Export obejct Track
module.exports = {
    Playlist: Playlist
}