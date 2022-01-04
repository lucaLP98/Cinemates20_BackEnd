CREATE DATABASE cinemates_db;

USE cinemates_db;


CREATE TABLE users(
	user_id VARCHAR(50),
	email VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    biography TEXT,
    uri_profile_image TEXT,
    
    CONSTRAINT pk_user PRIMARY KEY(user_id)
);


CREATE TABLE reviews(
    id_review INT AUTO_INCREMENT,
    vote INT NOT NULL,
    description TEXT NOT NULL,
    user_owner VARCHAR(50) NOT NULL,
    id_film INT NOT NULL,
	film_title VARCHAR(50) NOT NULL, 
	film_poster TEXT NOT NULL

    CONSTRAINT pk_review PRIMARY KEY(id_review),
    CONSTRAINT review_vote_consistence CHECK(vote >= 1 AND vote <= 100),
    CONSTRAINT fk_review FOREIGN KEY(user_owner) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE notifications(
    id_notification INT AUTO_INCREMENT,
    text TEXT NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    notification_type VARCHAR(10) NOT NULL,
    id_film INT,
    
    CONSTRAINT pk_notification PRIMARY KEY(id_notification),
	CONSTRAINT fk_notification FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT type_notifications_constr CHECK (notification_type IN("SHARING", "REQUEST", "ACCEPT", "DECLINE"))
);

CREATE TABLE connection_requests(
    id_requests INT AUTO_INCREMENT,
    sender_user VARCHAR(50) NOT NULL,
    receiver_user VARCHAR(50) NOT NULL,

    CONSTRAINT pk_request PRIMARY KEY(id_requests),
    CONSTRAINT fk1_request FOREIGN KEY(sender_user) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk2_request FOREIGN KEY(receiver_user) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT request_consistence CHECK(sender_user <> receiver_user),
	CONSTRAINT unique_request UNIQUE(sender_user, receiver_user)
);


CREATE TABLE friendship(
    id_friendship INT AUTO_INCREMENT,
    first_user VARCHAR(50) NOT NULL,
    second_user VARCHAR(50) NOT NULL,

    CONSTRAINT pk_friendship PRIMARY KEY(id_friendship),
    CONSTRAINT fk1_friendship FOREIGN KEY(first_user) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk2_friendship FOREIGN KEY(second_user) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT friendship_consistence CHECK(first_user <> second_user),
	CONSTRAINT unique_friendship UNIQUE(first_user, second_user)
);


CREATE TABLE movie_sharing(
    id_sharing INT AUTO_INCREMENT,
    sender_user VARCHAR(50) NOT NULL,
    receiver_user VARCHAR(50) NOT NULL,
    id_film INT NOT NULL,

    CONSTRAINT pk_sharing PRIMARY KEY(id_sharing),
    CONSTRAINT fk1_sharing FOREIGN KEY(sender_user) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk2_sharing FOREIGN KEY(receiver_user) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT sharing_consistence CHECK(sender_user <> receiver_user),
    CONSTRAINT unique_sharing UNIQUE(sender_user, receiver_user, id_film)
);
