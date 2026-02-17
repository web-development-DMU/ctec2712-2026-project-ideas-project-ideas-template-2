# Database Design
***This includes the following:***
- [Tables](#tables)
- [Table Fields](#table-fields)
- [Table Relationships](#relationship-of-tables)
- [Database Queries](#database-queries)

___
### Tables:
- Catalog
- Chapters
- Users
- UserBookStatus

### Table fields:

___
### Catalog
| BookID                          | BookTitle | ReleaseDate | BookAbout | BookAuthor | BookPublisher | BookImage | BookStatus | BookSource       |
| ------------------------------- | --------- | ----------- | --------- | ---------- | ------------- | --------- | ---------- | ---------------- |
| PK, Int, auto increment, unique | varchar   | DateTime    | varchar   | varchar    | varchar       | varchar   | varchar    | varchar          |
___
### Chapters
| ChapterID                       | BookID  | ChapterName | ChapterRelease |
| ------------------------------- | ------- | ----------- | -------------- |
| PK, Int, auto increment, unique | FK, Int | varchar     | Datetime      |
___
### Users
| UserID                          | UserName | UserPass | DateCreated |
| ------------------------------- | -------- | -------- | ----------- |
| PK, Int, Auto increment, Unique | varchar  | varchar  | Timestamp   |
___
### UserBookStatus
| UserID  | ChapterID |
| ------- | --------- |
| FK, Int | FK, Int   |
___

# Relationship of tables
![alt text](DesignAssets/DatabaseDiagram.png)


___
# Database queries
## Adding user to database
```SQL
INSERT INTO Users (UserName, UserPass, DateCreated) 
VALUES (?, ?, ?);
```

## Find user for login, this will find their username and pass for verification - tested
```SQL
SELECT *
FROM Users 
WHERE UserName = (?);
```

## Selecting Book cover for the catalog page for a list - tested   
```SQL
SELECT BookTitle, BookImage
FROM Books;
```
## Get specific book page - tested
```SQL
SELECT * 
FROM Books catBalog
JOIN Chapters chapters
ON B.BookID = chapters.BookID
WHERE B.BookID = (?);
```
## Get current user chapter in book page - TO DO
```SQL
SELECT BookTitle, ChapterName
FROM Books B
JOIN Chapters CHP
ON B.BookID = CHP.BookID
WHERE B.BookID = (bookid?) AND CHP.BookCHPID = (
	SELECT BookCHPID
	FROM UserBookStatus
	WHERE UserID = (userid?) AND BookID = (bookid?));
```

## Adding to current session user favourites
```SQL
-- If statement before this query
DELETE FROM UserBookStatus
WHERE UserID = (?);
-- Endif

INSERT INTO UserBookStatus (UserID, BookCHPID)
VALUES (?, ?);
```