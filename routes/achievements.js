const { check, validationResult } = require('express-validator');

module.exports = function(app, appData) {
    const redirect_login = (req, res, next) => {
        if (!req.session.userId) {
            res.redirect(appData.basePath + '/users/login'); // redirect to the login page
        } else {
            next();
        }
    }

    // GET achievements form
    app.get('/achievements/add', redirect_login, function(req, res) {
        res.render('add_achievement.ejs', {
            appName: appData.appName,
            username: req.session.username,
            errors: []
        });
    });

    // POST add achievement
    app.post('/achievements/added', redirect_login,
    [
        check('activity')
        .notEmpty().withMessage('Activity is required')
        .isLength({ max: 100 }).withMessage('Activity must be under 100 characters'),

        check('date')
        .isISO8601().withMessage('Date must be valid (YYYY-MM-DD)'),

        check('duration_minutes')
        .optional()
        .isInt({ min: 0}).withMessage('Duration must be a positive integer'),

        check('calories_burned')
        .optional()
        .isInt({ min: 0}).withMessage('Calories must be a positive integer')
    ],

    function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('add_achievement.ejs', {
                appName: appData.appName,
                errors: errors.array()
            });
        }

        // Sanitize inputs
        const activity = req.sanitize(req.body.activity);
        const date = req.sanitize(req.body.date);
        const duration_minutes = req.sanitize(req.body.duration_minutes);
        const calories_burned = req.sanitize(req.body.calories_burned);

        const user_id = req.session.userId;
        const sqlquery = "INSERT INTO achievements (user_id, activity, date, duration_minutes, calories_burned) VALUES (?, ?, ?, ?, ?)";

        // Execute SQL query
        db.query(sqlquery, [user_id, activity, date, duration_minutes, calories_burned], (err, result) => {
            if (err) return next(err);

            res.send(`
                <h1>Achievement Added Successfully!</h1>
                <p>You did ${activity} on ${date} for ${duration_minutes} minutes! That must have been tiring, phew!</p>
                <p>During this, you burned ${calories_burned} calories.WOW!</p>
                <p>Good Stuff!</p>
                <p><a href="/">Return to Home</a></p>
                `);
        });
    });

    // GET achievements list (for logged-in user)
    app.get('/achievements/show', redirect_login, function(req, res, next) {
        const user_id = req.session.userId;
        const sqlquery = "SELECT * FROM achievements WHERE user_id = ? ORDER BY date DESC";

        // Execute SQL query
        db.query(sqlquery, [user_id], (err, results) => {
            if (err) return next(err);

            res.render('list_achievements.ejs', {
                appName: appData.appName,
                username: req.session.username,
                achievements: results
            });
        });
    });
}