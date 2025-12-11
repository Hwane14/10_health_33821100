const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const redirect_login = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // redirect to the login page
    } else {
        next();
    }
}

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
            .withMessage('First name must be between 2 and 30 characters long')
            .matches(/^[A-Za-z\s'-]+$/).withMessage('First name may contain letters, spaces, hyphens, or apostrophes'),

            check('last')
            .trim()
            .isLength({ min: 2, max: 30 })
            .withMessage('Last name must be between 2 and 30 characters long')
            .matches(/^[A-Za-z\s'-]+$/).withMessage('Last name may contain letters, spaces, hyphens, or apostrophes'),

            check('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email address'),

            check('username')
            .trim()
            .isLength({ min: 2, max: 20 })
            .withMessage('Username must be 2-20 characters long'),

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

            // Sanitize inputs
            const clean_first = req.sanitize(req.body.first.trim());
            const clean_last = req.sanitize(req.body.last.trim());
            const clean_email = req.sanitize(req.body.email.trim());
            const clean_username = req.sanitize(req.body.username.trim());
            const clean_password = req.body.password.trim();

            // Check if username or email already exists
            let checkQuery = "SELECT * FROM user_data WHERE username = ? OR email = ?";
            db.query(checkQuery, [clean_username, clean_email], (err, result) => {
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
                bcrypt.hash(clean_password, saltRounds, function(err, hashedPassword) {
                    if (err) return next(err);

                    let sqlquery = "INSERT INTO user_data (username, first_name, last_name, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
                    let newrecord = [clean_username, clean_first, clean_last, clean_email, hashedPassword];

                    db.query(sqlquery, newrecord, (err, result) => {
                        if (err) return next(err);

                        res.send(`
                            <h1>Registration Successful</h1>
                            <p>Hello ${clean_first} ${clean_last}, you are now registered!</p>
                            <p>We will send an email to you at ${clean_email}.</p>
                            <p><a href="/">Return to Home</a></p>
                            `);
                    });
                });
            });
        }
    );

    // GET login form
    app.get('/users/login', function(req, res) {
        res.render('login.ejs', { ...appData, errors: [] });
    });

    // POST login form
    app.post('/users/loggedin', 
        [
            check('username')
            .trim()
            .isLength({ min: 2, max: 20 })
            .withMessage('Username must be 2-20 characters long'),

            check('password')
            .trim()
            .notEmpty()
            .withMessage('Password is required')
        ],

        function(req, res, next) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('login.ejs', { ...appData, errors: errors.array() });
            }

            const clean_username = req.sanitize(req.body.username.trim());
            const clean_password = req.body.password.trim();

            let sqlquery = "SELECT id, username, hashedPassword FROM user_data WHERE username = ?";

            db.query(sqlquery, [clean_username], async (err, result) => {
                if (err) return next(err);

                if (result.length === 0) {
                    db.query("INSERT INTO login_attempts (username, success, reason) VALUES (?, ?, ?)",
                        [clean_username, false, "Invalid username"]);
                    return res.send(`
                        <h1>Login Failed</h1>
                        <p>Invalid username</p>
                        <p><a href="/">Return to Home</a></p>
                        `);
                }

                const user = result[0];

                try {
                    const match = await bcrypt.compare(clean_password, user.hashedPassword);

                    if (match) {
                        // Store numeric id in session
                        req.session.userId = user.id;
                        req.session.username = user.username;

                        db.query("INSERT INTO login_attempts (username, success, reason) VALUES (?, ?, ?)",
                            [clean_username, true, "Login successful"]);

                        res.send(`
                            <h1>Login Successful</h1>
                            <p>Welcome back, ${clean_username}!</p>
                            <p><a href="/">Return to Home</a></p>
                            `);
                    } else {
                        db.query("INSERT INTO login_attempts (username, success, reason) VALUES (?, ?, ?)",
                            [clean_username, false, "Invalid Password"]);

                        res.send(`
                            <h1>Login Failed</h1>
                            <p>Invalid Password.</p>
                            <p><a href="/">Return to Home</a></p>
                            `);
                    }
                } catch (compareErr) {
                    next(compareErr);
                }
            });
        }
    );

    // GET user list (protected)
    app.get('/users/list', redirect_login, function(req, res, next) {
        let sqlquery = "SELECT * FROM user_data";

        // Execute SQL query
        db.query(sqlquery, (err, result) => {
            if (err) return next(err);

            res.render('user_list.ejs', {
                users: result,
                appData: appData
            });
        });
    });

    // GET login attempts (protected)
    app.get('/users/audit', redirect_login, function(req, res, next) {
        let sqlquery = "SELECT * FROM login_attempts ORDER BY attemptTime DESC";

        // Execute SQL query
        db.query(sqlquery, (err, result) => {
            if (err) return next(err);

            res.render('audit_history.ejs', {
                attempts: result,
                appData: appData
            });
        });
    });

    // GET logout
    app.get('/users/logout', redirect_login, (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('../');
            }
            res.send('You are now logged out. <a href=' + '../' + '>Back to Home</a>');
        });
    });
};