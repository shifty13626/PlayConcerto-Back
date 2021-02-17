class Config {
    constructor(databse_name, adress, user, password) {
        this.database_name = databse_name;
        this.adress = adress;
        this.user = user;
        this.password = password;
    }
}

// Export obejct Track
module.exports = {
    Config: Config
}