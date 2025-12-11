# Insert data into the tables
USE health;

INSERT IGNORE INTO user_data (username, first_name, last_name, email, hashedPassword)
VALUES ('gold', 'Gold', 'Marker', 'gold@example.com', '$2b$10$YjKHvJWotAKD7PRi2uPzyOnwkuHVfAWgH.Gcitq3TEmeE2ogwJZFi');