class User {
    constructor(pseudo, password, firstname, lastname) {
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
