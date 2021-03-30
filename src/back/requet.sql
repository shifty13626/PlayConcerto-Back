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
SELECT COUNT(*) AS nbUser FROM user;

-- Delete all element in tables
DELETE FROM link_playlist;
DELETE FROM link_artist;
-- DELETE FROM playlist;
DELETE FROM track;
DELETE FROM artist;
-- DELETE FROM genre;

-- insert value test
INSERT INTO artist (name) VALUE ('MUSE');
INSERT INTO track (title, year, duration, add_date)
VALUES ('I Put A Spell On You', 2021, 4.56, NOW());
insert into link_artist (id_track, id_artist) VALUES ();
INSERT INTO genre (name) VALUE ('Rock');
INSERT INTO playlist (name, id_genre) VALUES ('Top', 1);
INSERT INTO link_playlist (id_playlist, id_track)
VALUES (1, 84);

SELECT *
FROM track, link_artist
WHERE track.title = ""
  AND track.id_track = link_artist.id_track
  AND link_artist.id_artist =

select * from artist where name = 'MamieSmith'



SELECT *
FROM track
WHERE title = 'I Put A Spell On You'
ORDER BY add_date DESC;

-- dataset example to import, launch command after command
insert into user (pseudo, firstname, lastname, password)
values ('shifty', 'Ludo', 'hamel' , 'password');
insert into genre (name) value ('rock');
insert into playlist (name, id_genre) values ('playlist_test', 7);
insert into link_user_playlist (id_user, id_playlist) values (3, 4);
insert into track (title, year, duration, danceability, energy, instrumentalness, liveness, popularity, add_date)
VALUES ('Supremacy', 2021, 4.55, 0.0, 100.0, 90.1, 100.0, 60.5, NOW());
insert into link_playlist (id_playlist, id_track) values (4, 2689);