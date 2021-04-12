class User {
    constructor(id_user, pseudo, password, firstname, lastname) {
        this.id = id_user;
        this.pseudo = pseudo;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
    }
}

// Export obejct Track
module.exports = {
    User: User
}
