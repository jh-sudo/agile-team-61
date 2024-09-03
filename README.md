### CM2020 Agile Software Projects ###

#### Installation requirements ####
* NodeJS 
* Sqlite2 

#### Running the application ####
* Open 2 seprate terminals, one for the frontend another for the backend.

* Run ```npm i``` from each directory(frontend and backend) to install all the node packages.

* Run ```npm start``` to start the frontend

* Run ```node server``` to start the backend

##### Creating database tables #####

* For this project, there's 4 database table that is used: checklist, itinerary, itinerary_metadata and user.

* Here are the table creation:

* checklist table:
    CREATE TABLE `checklist` (
        `id` int NOT NULL AUTO_INCREMENT,
        `user_id` int NOT NULL,
        `item` text NOT NULL,
        `is_checked` tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`),
        KEY `user_id` (`user_id`),
        CONSTRAINT `checklist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    )

* itinerary table:
    CREATE TABLE `itinerary` (
        `id` int NOT NULL AUTO_INCREMENT,
        `user_id` int NOT NULL,
        `itinerary_metadata_id` int NOT NULL,
        `day` int NOT NULL,
        `title` text NOT NULL,
        `details` text NOT NULL,
        PRIMARY KEY (`id`)
    )

* itinerary_metadata table:
    CREATE TABLE `itinerary_metadata` (
        `id` int NOT NULL AUTO_INCREMENT,
        `user_id` int NOT NULL,
        `title` text,
        `period` text,
        `last_edited` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    )

* user table:
    CREATE TABLE `users` (
        `id` int NOT NULL AUTO_INCREMENT,
        `username` varchar(50) NOT NULL,
        `password` varchar(255) NOT NULL,
        `email` varchar(100) NOT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `email` (`email`)
    )