// Import the modules we need
const express = require ('express');
const ejs = require('ejs');
const bodyParser= require ('body-parser');
const mysql = require('mysql2');
require('dotenv').config();
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express()
const port = 8000
app.use(bodyParser.urlencoded({ extended: true }))

// Create an input sanitizer
app.use(expressSanitizer());

// Set up css
app.use(express.static(__dirname + '/public'));

// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}));

// Set the directory where Express will pick up HTML files
// __dirname will get the current directory
app.set('views', __dirname + '/views');

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Tells Express how we should process html files
// We want to use EJS's rendering engine
app.engine('html', ejs.renderFile);

// Define our data
var appData = {
    appName: "Healthy Wealthy",
    basePath: process.env.HEALTH_BASE_PATH
}

// Define the database connection pool
const db = mysql.createPool({
    host: process.env.HEALTH_HOST,
    user: process.env.HEALTH_USER,
    password: process.env.HEALTH_PASSWORD,
    database: process.env.HEALTH_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

// Requires the main.js file inside the routes folder passing in the Express app and data as arguments.  All the routes will go in this file
require("./routes/main")(app, appData);
require("./routes/users")(app, appData);
require("./routes/achievements")(app, appData);
require("./routes/gear")(app, appData);
require("./routes/api")(app, appData);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))