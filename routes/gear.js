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
}