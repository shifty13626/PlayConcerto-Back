class Track {
    constructor(artist, danceability, duration, energy, instrumentalness, liveness, name, popularity, year) {
    this.artist = artist;
    this.danceability = danceability;
    this.duration = duration;
    this.energy = energy;
    this.instrumentalness = instrumentalness;
    this.liveness = liveness;
    this.name = name
    this.popularity = popularity;
    this.year = year;
    }
}

// Export obejct Track
module.exports = {
    Track: Track
}