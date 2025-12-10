module.exports = function(app, appData) {
    // Home page route
    app.get('/', function(req, res) {
        res.render('home.ejs', {
            appName: appData.appName
        });
    });

    // About page
    app.get('/about', function(req, res) {
        res.render('about.ejs', {
            appName: appData.appName
        });
    });
}