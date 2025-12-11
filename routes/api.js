module.exports = function(app, appData) {
    app.get('/api/gear', function (req, res, next) {
        let search_term = req.query.search;
        let min_price = req.query.minprice;
        let max_price= req.query.maxprice;
        let sort_by = req.query.sort;

        let sqlquery = "SELECT * FROM gym_gear";
        let conditions = [];
        let values = [];

        // Add search condition if provided
        if (search_term) {
            conditions.push("LOWER(name) LIKE LOWER(?)");
            values.push("%" + search_term + "%");
        }

        const min = Number(min_price);
const max = Number(max_price);
        // Add price range condition if provided
        if (Number.isFinite(min) && Number.isFinite(max)) {
            conditions.push("price BETWEEN ? AND ?");
            values.push(min, max);
        } else if (Number.isFinite(min)) {
            conditions.push("price >= ?");
            values.push(min);
        } else if (Number.isFinite(max)) {
            conditions.push("price <= ?");
            values.push(max);
        }

        // If conditions exist, append them to the query
        if (conditions.length > 0) {
            sqlquery += " WHERE " + conditions.join(" AND ");
        }

        // Sorting
        if (sort_by) {
            if (sort_by === "name") {
                sqlquery += " ORDER BY name ASC";
            } else if (sort_by === "price") {
                sqlquery += " ORDER BY price ASC";
            }
        }

        // Execute the SQL query
        db.query(sqlquery, values, (err, result) => {
            if (err) {
                next(err);
            } else {
                res.json(result); // Return gear as JSON
            }
        })
    })
}