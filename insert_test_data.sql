# Insert data into the tables
USE health;

# Exising user
INSERT IGNORE INTO user_data (username, first_name, last_name, email, hashedPassword)
VALUES ('gold', 'Gold', 'Marker', 'gold@example.com', '$2b$10$YjKHvJWotAKD7PRi2uPzyOnwkuHVfAWgH.Gcitq3TEmeE2ogwJZFi');

# Achievements for Gold (user_id = 1)
INSERT INTO achievements (user_id, activity, date, duration_minutes, calories_burned) VALUES
(1, 'Running', '2025-12-01', 30, 300),
(1, 'Cycling', '2025-12-03', 45, 450),
(1, 'Swimming', '2025-12-05', 60, 600),
(1, 'Yoga', '2025-12-07', 40, 200);

# Gym gear items
INSERT INTO gym_gear (name, price) VALUES
('Dumbbell Set', 59.99),
('Barbell', 120.00),
('Weight Plates (20kg)', 45.00),
('Kettlebell (12kg)', 35.00),
('Resistance Bands', 15.99),
('Pull-up Bar', 39.99),
('Bench Press', 150.00),
('Squat Rack', 299.99),
('Treadmill', 799.00),
('Exercise Bike', 499.00),
('Rowing Machine', 699.00),
('Jump Rope', 9.99),
('Yoga Mat', 25.00),
('Foam Roller', 19.99),
('Medicine Ball (5kg)', 29.99),
('Punching Bag', 89.99),
('Boxing Gloves', 49.99),
('Ankle Weights', 24.99),
('Ab Roller', 22.00),
('Gym Ball', 34.99);