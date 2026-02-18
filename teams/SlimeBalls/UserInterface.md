
---------------------

Dcocument each rout: for each document the following:

- The URL
- The request method (GET or POST)
- What the server does
- Any side effects this has on the database state
What the client receives in response (e.g. html response or redirect to
another url)

## Routes:

#### GET /

This url is for the homepage/index page of the webapplication.
The server returns index page & database query for the most recent books added to the database.
This is a 'GET' request and is therfore safe, this should not effect the state of the database, it only reads information from the database.

#### GET /Catologue
This url is for that catalogue page.
The server returns a list off all books available within the database.
This is a 'GET' request and is therfore safe, this should not effect the state of the database, it only reads information from the database.

#### GET /Catologue/:bookId
This url points to an individual book within the catalogue.
The server retuns the information of the book that was requested from the database.
This is a 'GET' request and is therfore safe, this should not effect the state of the database, it only reads information from the database.

#### GET /profile/:userId
This url points to the profile of the user.
The server retuns the profile page of the current user session, from the database including a querey result of a user's favourite books and the user's profile name.
This is a 'GET' request and is therfore safe, this should not effect the state of the database, it only reads information from the database.

#### GET /help
This url points to the help page of the web-application.
The server would return the requested static help page html file.
This is a 'GET' request and is therfore safe, this should not effect the state of the database, it only reads information from the database.

#### GET /about
This url points to the about page of the web-application.
The server would retun the requested static about page html file.
This is a 'GET' request and is therfore safe, this should not effect the state of the database, it only reads information from the database.

#### GET /login
This url points to the login page.
The server would return the requested static login page html file.
This is a 'GET' request and is therfore safe, this should not effect the state of the database, it only reads information from the database.

#### GET /signup
This url points to the sighnup page.
The server would return the static signup page html file.
This is a 'GET' request and is therfore safe, this should not effect the state of the database, it only reads information from the database.

#### POST /Login
This url points to the login page
The server would send data to the detabase to indicate which users is logged in on that client.
This is a 'POST' request and is therfore unsafe, this will effect the structure of the database, and will try to add data to it.

#### POST /signup
This url points to the signup page.
The server would try to create/add an account to the database using the details that were inputted by the user.
This is a 'POST' request and is therfore unsafe, this will effect the structure of the database, and will try to add data to it.

#### POST /catalogue/book/:bookId:bookChpId
This url points to the chapter(s) of the specified book.
The server would try to either insert or update the bookmark table within the database.
This is a 'POST' request and is therfore unsafe, this will effect the structure of the database, and will try to add data to it.

#### Post /catalogue/book/:bookId
This url points to a specified book.
The server would try to insert a book into the favourites tablie within the database.
This is a 'POST' request and is therfore unsafe, this will effect the structure of the database, and will try to add data to it.
 