const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

module.exports = function(app, appData) {
    // GET register form
    app.get('/register', function(req, res) {
        res.render('register.ejs', {
            appName: appData.appName,
            errors: []
        });
    });

    // POST register form
    app.post('/registered',
        [
            check('first')
            .trim()
            .isLength({ min: 2, max: 30 })
            .withMessage('First name must be between 2 and 30 characters')
            .matches(/^[A-Za-z\s'-]+$/).withMessage('First name may contain letters, spaces, hyphens, or apostrophes'),

            check('last')
            .trim()
            .isLength({ min: 2, max: 30 })
            .withMessage('First name must be between 2 and 30 characters')
            .matches(/^[A-Za-z\s'-]+$/).withMessage('First name may contain letters, spaces, hyphens, or apostrophes'),

            check('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email address'),

            check('username')
            .trim()
            .isLength({ min: 3, max: 20 })
            .withMessage('Username must be 3-20 characters long'),

            check('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
            .matches(/\d/).withMessage('Password must contain at least one number')
            .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character')
        ],

        function(req, res, next) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('register.ejs', {
                    appName: appData.appName,
                    errors: errors.array()
                });
            }

            const { first, last, email, username, password } = req.body;

            // Check if username or email already exists
            let checkQuery = "SELECT * FROM user_data WHERE username = ? OR email = ?";
            db.query(checkQuery, [username, email], (err, result) => {
                if (err) return next(err);

                if (result.length > 0) {
                    return res.send(`
                        <h1>Registration Failed</h1>
                        <p>The username or email is already registered. Please choose another.</p>
                        <p><a href="/register">Return to Registration</a></p>
                        `);
                }

                // Hash password and insert
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
                    if (err) return next(err);

                    let sqlquery = "INSERT INTO user_data (username, first_name, last_name, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
                    let newrecord = [username, first, last, email, hashedPassword];

                    db.query(sqlquery, newrecord, (err, result) => {
                        if (err) return next(err);

                        res.send(`
                            <h1>Registration Successful</h1>
                            <p>Hello ${first} ${last}, you are now registered!</p>
                            <p>We will send an email to you at ${email}.</p>
                            <p><a href="/">Return to Home</a></p>
                            `);
                    });
                });
            });
        }
    );
};