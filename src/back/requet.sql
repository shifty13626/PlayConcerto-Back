-- All select of tables
SELECT * FROM artist;
SELECT * FROM track;
SELECT * FROM link_playlist;
SELECT * FROM link_artist;
SELECT * FROM genre;
SELECT * FROM playlist;

-- Count all table
SELECT COUNT(*) AS nbTrack FROM track;
SELECT COUNT(*) AS nbArtist FROM artist;
SELECT COUNT(*) AS nbPlaylist FROM playlist;
SELECT COUNT(*) AS nbGenre FROM genre;

-- Delete all element in tables
DELETE FROM link_playlist;
DELETE FROM link_artist;
-- DELETE FROM playlist;
DELETE FROM track;
DELETE FROM artist;
-- DELETE FROM genre;

-- insert value test
INSERT INTO artist (name) VALUE ('MUSE');
INSERT INTO track (name, year, duration, add_date)
VALUES ('I Put A Spell On You', 2021, 4.56, NOW());
insert into link_artist (id_track, id_artist) VALUES ();
INSERT INTO genre (name) VALUE ('Rock');
INSERT INTO playlist (name, id_genre) VALUES ('Top', 1);
INSERT INTO link_playlist (id_playlist, id_track)
VALUES (1, 84);

SELECT *
FROM track, link_artist
WHERE track.name = ""
  AND track.id_track = link_artist.id_track
  AND link_artist.id_artist =

select * from artist where name = 'MamieSmith'



SELECT *
FROM track
WHERE name = 'I Put A Spell On You'
ORDER BY add_date DESC;