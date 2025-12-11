# Create the database
CREATE DATABASE IF NOT EXISTS health;
USE health;

# Create the tables
# Table to store user data
CREATE TABLE IF NOT EXISTS user_data (
    id INT AUTO_INCREMENT,
    username VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(255),
    hashedPassword VARCHAR(255),
    PRIMARY KEY(id),
    CONSTRAINT unique_username UNIQUE (username),
    CONSTRAINT unique_email UNIQUE (email)
);

# Table to store achievements
CREATE TABLE IF NOT EXISTS achievements (
    id INT AUTO_INCREMENT,
    user_id INT, -- Foreign key reference to user_data.id
    activity VARCHAR(100),
    description VARCHAR(255),
    date DATE,
    duration_minutes INT,
    calories_burned INT,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES user_data(id)
);

# Create the application user
CREATE USER IF NOT EXISTS 'health_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';