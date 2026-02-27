import { db } from "../tools/db.js";

db.exec(`
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS carwashes;
    DROP TABLE IF EXISTS services;
    DROP TABLE IF EXISTS timeslots;
    DROP TABLE IF EXISTS bookings;


    CREATE table users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name STRING NOT NULL,
        is_admin BOOLEAN NOT NULL,
        email STRING,
        phone_number STRING
    );

    CREATE table carwashes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email STRING,
        phone_number STRING,
        postcode STRING,
        address STRING,
        photo STRING
    );

    CREATE table services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name STRING NOT NULL,
        description TEXT NOT NULL,
        carwash_id INTEGER,
        fee DECIMAL NOT NULL,
        FOREIGN KEY(carwash_id) REFERENCES carwashes(id)
    );

    CREATE table timeslots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_at DATETIME NOT NULL,
        end_at DATETIME NOT NULL,
        available BOOLEAN NOT NULL
    );

    CREATE table bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        carwash_id INTEGER,
        service_id INTEGER,
        start_at DATETIME NOT NULL,
        end_at DATETIME NOT NULL,
        total_fee DECIMAL NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(carwash_id) REFERENCES carwashes(id),
        FOREIGN KEY(service_id) REFERENCES services(id)
    );

    INSERT INTO users (name, is_admin, email, phone_number) VALUES
    ('Sarah Jenkins', 0, 's.jenkins@email.com', '555-0101'),
    ('Marcus Thorne', 1, 'm.thorne@admin.com', '555-0102'),
    ('Linda McCartney', 0, 'linda.m@provider.net', '555-0103'),
    ('David Vance', 0, 'dvance88@webmail.com', '555-0104'),
    ('Chloe Zhang', 0, 'chloe.z@domain.com', '555-0105');

    INSERT INTO carwashes (email, phone_number, postcode, address, photo) VALUES
    ('city.shine@wash.com', '555-2001', 'SW1A 1AA', '122 Baker St, London', 'shine_exterior.jpg'),
    ('bubblz@wash.com', '555-2002', 'M1 1AE', '45 Industrial Way, Manchester', 'bubblz_front.png'),
    ('express.clean@wash.com', '555-2003', 'G1 1QX', '88 Highland Rd, Glasgow', 'express_view.jpg'),
    ('eco.steam@wash.com', '555-2004', 'B1 1BB', '12 Green Lane, Birmingham', 'eco_steam.png'),
    ('valet.pro@wash.com', '555-2005', 'LS1 1UR', '77 Regency Square, Leeds', 'valet_pro.jpg');

    INSERT INTO services (name, description, carwash_id, fee) VALUES
    ('Basic Wash', 'Exterior rinse and dry', 1, 15.00),
    ('Full Interior', 'Deep vacuum and upholstery clean', 2, 45.00),
    ('Ceramic Coating', 'Premium paint protection', 3, 120.00),
    ('Eco Steam Clean', 'Water-saving steam technology', 4, 35.00),
    ('The Royal Valet', 'Complete inside-out detailing', 5, 80.00);

    INSERT INTO timeslots (start_at, end_at, available) VALUES
    ('2026-03-01 09:00:00', '2026-03-01 10:00:00', 0),
    ('2026-03-01 10:00:00', '2026-03-01 11:00:00', 0),
    ('2026-03-01 11:00:00', '2026-03-01 12:00:00', 0),
    ('2026-03-01 13:00:00', '2026-03-01 14:00:00', 0),
    ('2026-03-01 14:00:00', '2026-03-01 15:00:00', 0);

    INSERT INTO bookings (user_id, carwash_id, service_id, start_at, end_at, total_fee) VALUES
    (1, 1, 1, '2026-03-01 09:00:00', '2026-03-01 10:00:00', 15.00),
    (2, 2, 2, '2026-03-01 10:00:00', '2026-03-01 11:00:00', 45.00),
    (3, 3, 3, '2026-03-01 11:00:00', '2026-03-01 12:00:00', 120.00),
    (4, 4, 4, '2026-03-01 13:00:00', '2026-03-01 14:00:00', 35.00),
    (5, 5, 5, '2026-03-01 14:00:00', '2026-03-01 15:00:00', 80.00);
`);
