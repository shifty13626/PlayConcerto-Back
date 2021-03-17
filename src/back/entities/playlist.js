class Playlist {
    constructor(name, id_genre) {
        this.name = name;
        this.id_genre = id_genre;
    }
}

// Export obejct Track
module.exports = {
    Playlist: Playlist
}