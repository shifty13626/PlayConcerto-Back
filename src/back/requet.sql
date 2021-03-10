-- All select of tables
SELECT * FROM artist;
SELECT * FROM track;
SELECT * FROM link_playlist;
SELECT * FROM genre;
SELECT * FROM playlist;

-- Delete all element in tables
--DELETE FROM link_playlist;
--DELETE FROM playlist;
--DELETE FROM track;
--DELETE FROM artist;
--DELETE FROM genre;


-- insert value test
INSERT INTO artist (name) VALUE ('MUSE');
INSERT INTO track (name, year, duration, artist_id)
VALUES ('Supremacy', 2021, 4.56, 155);
insert into link_artist (id_track, id_artist) VALUES ();
INSERT INTO genre (name) VALUE ('Rock');
INSERT INTO playlist (name, id_genre) VALUES ('Top', 1);
INSERT INTO link_playlist (id_playlist, id_track)
VALUES (1, 84);