class Track {
    constructor(artist, duration, name, year) {
    this.artist = artist;
    this.duration = duration;
    this.name = name
    this.year = year;
    }
}

// Export obejct Track
module.exports = {
    Track: Track
}