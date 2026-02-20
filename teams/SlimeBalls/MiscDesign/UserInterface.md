____
# Web page sketches on Canva

## Index page
![Index page](/SlimeBookCanvaDesign/1.png)

*This page will contain a small about us, about the website and include a few of the recently added books. (Recently added to the DB anyways...)*

## Catalogue page
![Catalogue page](/SlimeBookCanvaDesign/2.png)

*This page will either contain a limited amount or all of the book in the DB. If the data set is too large we may need to add a load more button at the bottom.*

*Anyways the book covers are going to technically be links to their own page which will show the users the chapters and what chapter they are currently on. We may add a little star in the corner to show that you may favourite that book from this page. The users will be able to search for a specific book using the search bar.*

## Book page
![Book page](/SlimeBookCanvaDesign/3.png)

*This is our prototype look of a specific book page. Here it contains all of its information and all of the books chapters.*

*The user will then be able to bookmark a ca=hapter and it will update it to say "currently reading". The users will also be able to search for a specific chapter.*

## Login/Sign-up page
![Login/Sign-up page](/SlimeBookCanvaDesign/4.png)

*This is what our login/sign-up page will look like. We decided to stick to something simple for this and not overcomplicate a form.*

***There will be a link at the bottom of the login which will say "create an account?" or vice verse of "already have an account?"***


## About page
![About page](/SlimeBookCanvaDesign/5.png)

*This contains more about us :P*

## FAQ page
![FAQ page](/SlimeBookCanvaDesign/6.png)

***FREQUENTLY ASKED QUESTIONS... does anyone have any questions about our webpage so far???***

## profile page
![profile page](/SlimeBookCanvaDesign/7.png)

*This is the specific profile page of the current user in session. It will display the users favourite books and/or chapters...*


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
 