const express = require('express');
const router = express.Router();

// Import your database connection


// GET /api/books → return all books in JSON
router.get('/books', (req, res, next) => {
    //const sqlquery = "SELECT * FROM books";

   /* db.query(sqlquery, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return next(err);
        } 
        res.json(result);
    }); */

    const { search, minprice, maxprice, sort } = req.query;

    // Base query
    let sqlquery = "SELECT * FROM books WHERE 1=1"; // 1=1 makes appending conditions easier
    const params = [];

    // Search by keyword in title or author
    if (search) {
        sqlquery += " AND (title LIKE ? OR author LIKE ?)";
        const keyword = `%${search}%`;
        params.push(keyword, keyword);
    }

    // Price range
    if (minprice) {
        sqlquery += " AND price >= ?";
        params.push(minprice);
    }
    if (maxprice) {
        sqlquery += " AND price <= ?";
        params.push(maxprice);
    }

    // Sorting
    if (sort === "name") {
        sqlquery += " ORDER BY title ASC";
    } else if (sort === "price") {
        sqlquery += " ORDER BY price ASC";
    }

    // Execute the query
    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return next(err);
        }
        res.json(result);
});
});

module.exports = router;