class Config {
    constructor(databse_name, address, user, password, pathJsonTracks, pathCSVToRead) {
        this.database_name = databse_name;
        this.address = address;
        this.user = user;
        this.password = password;
        this.pathJsonTracks = pathJsonTracks;
        this.pathCSVToRead = pathCSVToRead;
    }
}

// Export obejct Track
module.exports = {
    Config: Config
}