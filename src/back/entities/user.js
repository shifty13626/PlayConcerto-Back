class User {
    constructor(firstname, lastname, playlists) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.playlists = playlists
    }
}

// Export obejct Track
module.exports = {
    User: User
}