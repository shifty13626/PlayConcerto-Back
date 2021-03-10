class Config {
    constructor(database_name, address, user, password, pathJsonTracks, pathCSVToRead, port) {
        this.database_name = databse_name;
        this.address = address;
        this.user = user;
        this.password = password;
        this.pathJsonTracks = pathJsonTracks;
        this.pathCSVToRead = pathCSVToRead;
        this.port = port;
    }
}

// Export obejct Track
module.exports = {
    Config: Config
}