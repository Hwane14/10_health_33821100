# Create the database
CREATE DATABASE IF NOT EXISTS healthy_wealthy;
USE healthy_wealthy;

# Create the tables
# Table to store achievements
CREATE TABLE IF NOT EXISTS achievements (
    id INT AUTO_INCREMENT,
    activity VARCHAR(100),
    description VARCHAR(255),
    date DATE,
    duration_minutes INT,
    calories_burned INT,
    PRIMARY KEY(id)
);

# Table to store user data
CREATE TABLE IF NOT EXISTS user_data (
    id INT AUTO_INCREMENT,
    username VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(255),
    hashedPassword VARCHAR(255),
    PRIMARY KEY(id)
);

# Create the application user
CREATE USER IF NOT EXISTS 'fitness_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON healthy_wealthy.* TO 'fitness_app'@'localhost';