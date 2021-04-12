class Playlist {
    constructor(name, id_genre, id_user) {
        this.name = name;
        this.id_genre = id_genre;
        this.id_user = id_user;
    }
}

// Export object Track
module.exports = {
    Playlist: Playlist
}