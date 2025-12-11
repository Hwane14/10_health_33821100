const { check, validationResult } = require('express-validator');

module.exports = function(app, appData) {
    // GET list gym gear
    app.get('/gear/list', function(req, res, next) {
        let sqlquery = "SELECT * FROM gym_gear";

        // Execute SQL query
        db.query(sqlquery, (err, result) => {
            if (err) return next(err);

            res.render('gear_list.ejs', {
                available_gear: result,
                appData: appData
            });
        });
    });

    // GET list bargain gym gear
    app.get('/gear/bargain-list', function(req, res, next) {
        let sqlquery = "SELECT * FROM gym_gear WHERE price < 40";

        // Execute SQL query
        db.query(sqlquery, (err, result) => {
            if (err) {
                return next(err);
            }

            res.render('bargain_gear.ejs', {
                bargain_gear: result,
                appData: appData
            });
        });
    });

    // GET render search form for gym gear
    app.get('/gear/search', function(req, res) {
        res.render('gear_search_form.ejs', {
            appData: appData,
            errors: []
        });
    });

    // GET search for gym gear
    app.get('/gear/search-results',
        [
            check('keyword')
            .isLength({ min: 1, max: 50})
            .withMessage('Search keyword must be between 1 and 50 characters')
            .trim()
            .escape()
        ],

        function (req, res, next) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('gear_search_form.ejs', {
                    appData: appData,
                    errors: errors.array()
                });
            } 

            const clean_keyword = req.sanitize(req.query.keyword);
            let search_query = "SELECT * FROM gym_gear WHERE LOWER(name) LIKE LOWER(?)";
            let keyword = `%${clean_keyword}%`; // wrap with wildcards

            // Execute SQL query
            db.query(search_query, [keyword], (err, result) => {
                if (err) return next(err);

                res.render('gear_search_results.ejs', {
                    gear: result,
                    appData: appData,
                    keyword: clean_keyword
                });
            });
        }
    )
}