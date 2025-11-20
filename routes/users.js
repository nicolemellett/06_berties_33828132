// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')


const recordLoginAttempt = (username, userId, status, req) => {
  const ip = req.ip || req.connection.remoteAddress;
  const sql = "INSERT INTO login_audit (user_id, username, ip_address, status) VALUES (?, ?, ?, ?)";
  db.query(sql, [userId, username, ip, status], (err, result) => {
    if (err) console.error("Error recording login audit:", err);
  });
};

const saltRounds = 10


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
    
})



router.post('/registered', function (req, res, next) {

    const plainPassword = req.body.password

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
       
       
        let sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)"
        let newrecord = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword
        ]

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.error(err)
                res.send("Database error")
                return
            }

            // Step 11: output plain + hashed password
            let output = 'Hello ' + req.body.first + ' ' + req.body.last +
                ' you are now registered! We will send an email to ' + req.body.email + '<br>'

            output += 'Your password is: ' + req.body.password +
                '<br>Your hashed password is: ' + hashedPassword

            res.send(output)
        })

    }) // end bcrypt.hash

    // saving data in database
    // res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);                                                                              
}); 


router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT username, first, last, email FROM users"; 
    // (We deliberately do NOT select hashedPassword)

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("userslist.ejs", { users: result });
        }
    });
});

router.get('/login', (req, res) => {
  res.render('login.ejs'); // renders login.ejs
});

/*  router.post('/loggedin', (req, res) => {
  const { username, password } = req.body;

  // 1. Select the hashed password for the user from the database
  const sql = 'SELECT hashedPassword FROM users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.send('Database error');
    }

    if (results.length === 0) {
      // User not found
      return res.send('Login failed: user not found');
    }

    const hashedPassword = results[0].hashedPassword;

    // 2. Compare the password supplied with the password in the database
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) {
        console.error(err);
        return res.send('Error checking password');
      }

      if (result === true) {
        // Passwords match
        res.send(`Login successful! Welcome, ${username}`);
      } else {
        // Passwords do not match
        res.send('Login failed: incorrect password');
      }
    });
  });
});
*/

router.post('/loggedin', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.send('Database error');
    }

    if (results.length === 0) {
      // User not found → record failed login
      recordLoginAttempt(username, null, 'fail', req);
      return res.send('Login failed: user not found');
    }

    const user = results[0];
    bcrypt.compare(password, user.hashedPassword, (err, result) => {
      if (err) {
        console.error(err);
        return res.send('Error checking password');
      }

      if (result === true) {
        // Success → record login
        recordLoginAttempt(username, user.id, 'success', req);
        res.send(`Login successful! Welcome, ${username}`);
      } else {
        // Failure → record login
        recordLoginAttempt(username, user.id, 'fail', req);
        res.send('Login failed: incorrect password');
      }
    });
  });
});


router.get('/audit', (req, res) => {
 //if (!req.session.user || !req.session.user.isAdmin) {
   // return res.status(403).send("Access denied");
  //}

  const sql = "SELECT * FROM login_audit ORDER BY timestamp DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("Error fetching audit logs");
    res.render('audit.ejs', { auditLogs: results });
  });
});


// Export the router object so index.js can access it
module.exports = router
