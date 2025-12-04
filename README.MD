# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install node index.js

# Audit

We implemented an audit feature to track important user actions and changes within the application. Each time a user registers, logs in, an entry is recorded with a timestamp and relevant details. Audit logs are stored securely in the database in a dedicated table (login_audit). This allows us to review user activity and ensure accountability, while supporting troubleshooting and monitoring of system use. The feature was implemented in Node.js using standard logging practices and database inserts for each event.

# dotenv

To secure database credentials, we used the dotenv Node.js module. A .env file was created at the project root containing environment variables for the database, such as DB_HOST, DB_USER, DB_PASSWORD, and DB_DATABASE. In index.js, we load these variables using require('dotenv').config() and reference them via process.env. The .env file is included in .gitignore so sensitive information is never pushed to GitHub. Example .env structure: DB_HOST=localhost DB_USER=your_database_user DB_PASSWORD=your_database_password DB_DATABASE=your_database_name

# Access Control Implementation:
- `/list` → restricted to logged-in users
- `/audit` → restricted to logged-in users
- All other pages (home, login, register) → accessible to all as no security / confidentiality issues

## Bookshop API

Base URL: `http://localhost:8000/api`

### Endpoints

#### GET `/books`

Retrieve a list of books in JSON format.

**Query Parameters** (all optional):

- `search` → search term for title or author  
- `minprice` → minimum price filter  
- `maxprice` → maximum price filter  
- `sort` → sort results by `name` or `price`

**Examples:**

- Get all books:  
`GET /api/books`

- Search for books with "world":  
`GET /api/books?search=world`

- Books priced between £5 and £10:  
`GET /api/books?minprice=5&maxprice=10`

- Sort books by title:  
`GET /api/books?sort=name`

- Combine filters:  
`GET /api/books?search=universe&minprice=5&sort=price`

