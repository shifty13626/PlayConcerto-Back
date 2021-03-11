class Config {
    constructor(databse_name, address, port, user, password, pathJsonTracks, pathCSVToRead) {
        this.database_name = databse_name;
        this.address = address;
        this.port = port;
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