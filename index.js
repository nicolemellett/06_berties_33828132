// Import express and ejs
var session = require('express-session');
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
require('dotenv').config();
var mysql = require('mysql2');
const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express()
const port = 8000
// const usersRouter = require('./routes/users');

app.use(express.urlencoded({ extended: true })); // for form submissions
app.use(express.json()); // optional, if you also send JSON
app.use(expressSanitizer());

app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

//app.use('/users', usersRouter);

// Set up the body parser 
//app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

// Define our application-specific data
app.locals.shopData = {shopName: "Bertie's Books"}


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

global.db = db;


// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /books
const booksRoutes = require('./routes/books')
app.use('/books', booksRoutes)

const weatherRouter = require('./routes/weather');

app.use('/weather', weatherRouter);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))