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
}