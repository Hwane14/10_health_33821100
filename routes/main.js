module.exports = function(app, appData) {
    // Home page route
    app.get('/', function(req, res) {
        res.render('home.ejs', {
            appName: appData.appName
        });
    });
}