let mysql = require('mysql');

let connection;

module.exports = {
    // to open connection to DB
    OpenConnection : function OpenConnection(config) {
        connection = mysql.createConnection({
            host: config.address,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database_name
        });
        if (connection != null) console.log("Connected to DB")
        else console.log("NOT connected to DB")
        return connection;
    },

    // Function to add track on DB
    StoreTrackOnDB : async function (config, track) {
        console.log("Start import in DB, track : " +track.name +"'")
        console.log("Track before import procedure")
        console.log(track)

        try {
            // for each artist
            for (let i = 0; i < track.artist.length; i++) {
                // check artist already exist
                var tempId = await GetArtist(connection, track.artist[i]);

                // if artist not exist
                if (tempId === null) {
                    console.log("Artist '" +track.artist[i] +"', doesn't exist ... creation ...")
                    await InsertArtist(connection, track.artist[i])
                    console.log("Artist '" +track.artist[i] +"' created.")
                }

                track.list_artist_id.push(await GetArtist(connection, track.artist[i]));
            };


            // check song already exist
            track.id = await GetTrackInsert(connection, track);

            // If song don't exist, create it
            if(track.id === null)
            {
                console.log("Track '" +track.name +"', doesn't exist ... creation ...")
                InsertTrack(connection, track)
                console.log("Track '" +track.name +"' created.")
                track.id = await GetTrackInsert(connection, track);
            }
            else console.log("Track '" +track.name +"' already exist, not imported");

            // add link track / artist
            for (let i = 0; i < track.list_artist_id.length; i++) {
                InsertLinkTrackArtist(connection, track.id, track.list_artist_id[i])
                console.log("Track linked")
            }
            console.log("Track after import procedure")
            console.log(track)

            console.log()

        } catch (error) {
            console.log(error)
        }
    }
}
