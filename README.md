# PlayConcerto API

## Language
NodeJS

## Target
Create a web api that let a user to create its own playlists from a set of music, and navigate through it even offline.

## Launch
You can use this API with command :
**node indes.js** in folder 'PlayConcerto-Back/src/back'
### Argument
- Import : Import a dataset of track on the database
- Purge : Delete all element on database
- Listen : open listening og API.

## Documentation
**Swagger** are install to define all path of API.
[Swagger](http://localhost:3500/docs/).

## Configuration
Configuration are made with file **config.json**

- **database_name** : Name table in SQL server
- **address** : Address of database
- **port** : Port to connect on DB
- **user** : Username of credential for database
- **password** : Password of credential for database
- **pathJsonTracks** : Path of file (Json) where tracks imported should be save.
- **pathJsonGenre** : Path of file (Json) where genre imported should be save.
- **pathCSVTrackToRead** : Path of CSV for import tracks on DB
- **pathCSVGenreToRead** :  Path of CSV for import genre on DB
- **port_server** : Port where API should be listen.

## Contributor
- Chloé XAINTRAY
- Alexandre MARIE
- Ludovic HAMEL
