# Database Design
***This includes the following:***
- [Tables](#tables)
- [Table Fields](#table-fields)
- [Creating tables in SQL](#creating-tables-sql)
- [Table Relationships](#relationship-of-tables)
- [Database Queries](#queries-required)

___
### Tables:
- Books
- Chapters
- Users
- Bookmarks
- Favourites

### Table fields:

___
### Books
| BookID                          | BookTitle   | ReleaseDate | BookAbout    | BookAuthor  | BookPublisher | BookImage   | BookStatus 	| BookSource  |
| ------------------------------- | ----------- | ----------- | ------------ | ----------- | ------------- | ----------- | ------------ | ----------- |
| PK, Int, auto increment, unique | varchar(50) | DateTime    | varchar(255) | varchar(50) | varchar(50)   | varchar(50) | varchar(20)  | varchar(50) |
___
### Chapters
| ChapterId  | BookId  | ChapterName | ChapterRelease |
| ---------- | ------- | ----------- | -------------- |
| CK, Int    | CK, Int | varchar(50) | Datetime       |
___
### Users
| UserID                          | UserName 	| UserPass    | DateCreated |
| ------------------------------- | ----------- | ----------- | ----------- |
| PK, Int, Auto increment, Unique | varchar(50) | varchar(50) | Timestamp   |
___
### Bookmarks
| UserID  | BookCHPID | BookId  |
| ------- | --------- | ------- |
| FK, Int | CK, Int   | CK, Int |
___
### Favourites
| UserID  | BookId  |
| ------- | ------- | 
| FK, Int | FK, Int | 
___

# Creating Tables SQL
```SQL
-- CREATING THE USERS TABLE
CREATE TABLE "Users" (
	"UserId"	INTEGER NOT NULL UNIQUE,
	"Username"	TEXT NOT NULL UNIQUE,
	"UserPass"	TEXT NOT NULL,
	"DateCreated"	TEXT NOT NULL,
	PRIMARY KEY("UserId" AUTOINCREMENT)
);
```

# Creating Books Table
```SQL
-- CREATING THE BOOKS TABLE
CREATE TABLE "Books" (
	"BookId"	INTEGER NOT NULL UNIQUE,
	"BookTitle"	TEXT NOT NULL,
	"ReleaseDate"	TEXT NOT NULL,
	"BookAbout"	TEXT NOT NULL,
	"BookAuthor"	TEXT NOT NULL,
	"BookPublisher"	TEXT NOT NULL,
	"BookImage"	TEXT NOT NULL,
	"BookStatus"	TEXT NOT NULL,
	"BookSource"	TEXT NOT NULL,
	PRIMARY KEY("BookId" AUTOINCREMENT)
);
```

# Creating Chapters Table
```SQL
-- CREATING THE CHAPTERS TABLE
CREATE TABLE "Chapters" (
	"BookChpId"	INTEGER NOT NULL,
	"BookId"	INTEGER NOT NULL,
	"ChapterName"	TEXT NOT NULL,
	"ChapterRelease"	TEXT NOT NULL,
	PRIMARY KEY("BookChpId","BookId"),
	FOREIGN KEY("BookId") REFERENCES "Books"("BookId")
);
```

# Creating Bookmarks Table
```SQL
--CREATING THE BOOKMARKS TABLE
CREATE TABLE "Bookmarks" (
	"UserId"	INTEGER NOT NULL,
	"BookId"	INTEGER NOT NULL,
	"BookChpId"	INTEGER NOT NULL,
	FOREIGN KEY("BookId") REFERENCES "Books"("BookId")
);
```

# Creating Favourites Table
```SQL
-- CREATING THE FAVOURITES TABLE
CREATE TABLE "Favourites" (
	"UserId"	INTEGER NOT NULL,
	"BookId"	INTEGER NOT NULL,
	FOREIGN KEY("UserId") REFERENCES "Users"("UserId"),
	FOREIGN KEY("BookId") REFERENCES "Books"("BookId")
);
```

___

# Relationship of tables
![DB relationships design](/DBDesignAssets/relationshipDesign/DatabaseDiagram.png)
___
# Queries required:
## Route('/'):
### Get Recently added
```SQL
SELECT BookTitle, BookImage
FROM Books
ORDER BY BookId DESC
LIMIT 5;
```

## Route('/Catalogue')
### Get Books to display
```SQL
SELECT BookId, BookTitle, BookImage
FROM Books;
```
## Route('/Catalogue/:BookID')
### Get Specific book info
```sql
Select BookTitle, BookImage, BookAuthor, BookPublisher, BookAbout, BookSource
From Books
WHERE BookId = (?);
```

### Get all chapters related to the book
```sql
SELECT BookTitle, ChapterName, ChapterRelease
FROM Books B
JOIN Chapters CHP
ON B.BookId = CHP.BookId
WHERE B.BookId = (?);
```

### Get specific book bookmarks
```sql
SELECT BookTitle, ChapterName
FROM Books B
JOIN Chapters CHP
ON B.BookID = CHP.BookID
WHERE B.BookID = (?) AND CHP.BookCHPID = (
	SELECT BookCHPID
	FROM Bookmarks
	WHERE UserID = (?) AND BookID = (?));
```

## Route('/Profile/:UserID')
### Get user info
```sql
SELECT *
FROM Users
WHERE UserId = (?);
```
### Get user favourites
```sql
SELECT BookTitle, BookImage
FROM Books B
JOIN Favourites F
ON B.BookId = F.BookId
WHERE F.UserId = (?);
```

## Route('/Signup') POST
### Get the user data and insert into user table
```sql
-- CHECKS TO SEE IF USERNAME IS UNIQUE
SELECT *
FROM Users
WHERE Username = (?); 

-- IF username not found then insert

INSERT INTO Users (Username, UserPass)
VALUES (?, ?);
```

## Route('/Login') POST
### Check to make sure user account exists
```sql
-- Checks to see if user is in db
SELECT UserId
FROM Users
WHERE Username = (?);

-- If user does exist continue to check pass
SELECT UserPass
FROM Users
WHERE Username = (?);

-- Compare the password with what the user inputted and validate
```

## Route('/Catalogue/book/:BookId:BookChpId') POST
### Insert/update into bookmark
```sql
-- CHECK FOR EXISTING BOOKMARK
SELECT BookId
FROM Bookmarks
WHERE UserId = (?) AND BookId = (?);

-- IF IT EXISTS 
UPDATE Bookmarks
SET BookCHPID = (?)
WHERE UserId = (?) AND BookId = (?);

-- IF IT DOES NOT EXIST
INSERT INTO Bookmarks (UserId, BookId, BookChpId)
VALUES (?, ?, ?);
```

### Remove bookmark
```SQL
DELETE FROM Bookmarks
WHERE UserId = (?) AND BookId = (?);
```

## Route('/Catalogue/book/:BookId') POST
### Add book to favourites
```sql
INSERT INTO Favourites (UserId, BookId)
VALUES (?, ?);
```

### Remove book from favourites
```sql
DELETE FROM Favourites
WHERE UserId = (?) AND BookId = (?);
```