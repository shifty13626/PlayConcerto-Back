class User {
    constructor(pseudo, firstname, lastname, playlists) {
        this.pseudo = pseudo
        this.firstname = firstname;
        this.lastname = lastname;
        this.playlists = playlists
    }
}

// Export obejct Track
module.exports = {
    User: User
}