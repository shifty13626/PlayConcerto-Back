class Config {
    constructor(databse_name, address, port, user, password, pathJsonTracks, pathJsonGenre, pathCSVTrackToRead, pathCSVGenreToRead, port_server) {
        this.database_name = databse_name;
        this.address = address;
        this.port = port;
        this.user = user;
        this.password = password;
        this.pathJsonTracks = pathJsonTracks;
        this.pathJsonGenre = pathJsonGenre;
        this.pathCSVTrackToRead = pathCSVTrackToRead;
        this.pathCSVGenreToRead = pathCSVGenreToRead;
        this.port_server = port_server;
    }
}

// Export obejct Track
module.exports = {
    Config: Config
}