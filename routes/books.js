// Create a new router
const express = require("express")
const router = express.Router()

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all books
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("list", { availableBooks: result });
        }
    });
});

router.get('/search-result', function (req, res, next) {
    let keyword = req.query.keyword;

    // SQL query for partial match (advanced search)
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    
    db.query(sqlquery, ['%' + keyword + '%'], (err, result) => {
        if (err) {
            next(err);
        } else {
            // Render search.ejs and pass results
            res.render('search', {
                shopData: { shopName: 'Berties Books' }, 
                searchResults: result,
                keyword: keyword
            });
        }
    });
});


router.get('/addbook', function (req, res, next) {
  res.render('addbook.ejs');
});

router.get('/search', function (req, res, next) {
  res.render('search.ejs');
});

router.post('/bookadded', function (req, res, next) {
  // saving data in database
  let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
  
  // execute sql query
  let newrecord = [req.body.name, req.body.price];
  db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send('This book is added to database, name: ' + req.body.name + ' price ' + req.body.price);
    }
  });
});

// Route to list bargain books (priced under £20)
router.get('/bargainbooks', function (req, res, next) {
  // SQL query to select books with price < 20
  let sqlquery = "SELECT * FROM books WHERE price < 20";

  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    } else {
      // Render the bargainbooks.ejs page and pass the results
      res.render('bargainbooks', { availableBooks: result });
    }
  });
});

// Export the router object so index.js can access it
module.exports = router
