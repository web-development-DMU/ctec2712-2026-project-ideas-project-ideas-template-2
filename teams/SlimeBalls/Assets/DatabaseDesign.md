### Tables:
- Catalog
- Chapters
- Users
- UserBookStatus

### Table fields:

___
### Catalog
| BookID                          | BookTitle | ReleaseDate | BookAbout | BookAuthor | BookPublisher | BookImage | BookStatus | BookSource |
| ------------------------------- | --------- | ----------- | --------- | ---------- | ------------- | --------- | ---------- | ---------------- |
| PK, Int, auto increment, unique | String    | DateTime    | String    | String     | String        | String    | String     | String           |
___
### Chapters
| ChapterID                       | BookID  | ChapterName | ChapterRelease |
| ------------------------------- | ------- | ----------- | -------------- |
| PK, Int, auto increment, unique | FK, Int | String      | Datetime       |
___
### Users
| UserID                          | UserName | UserPass | DateCreated |
| ------------------------------- | -------- | -------- | ----------- |
| PK, Int, Auto increment, Unique | String   | String   | Timestamp   |
___
### UserBookStatus
| UserID  | ChapterID |
| ------- | --------- |
| FK, Int | FK, Int   |
___

# Relationship of databases
![Database Design image](/teams/SlimeBalls/Assets/DatabaseDesignsofar.png)

___
# Database queries
## Adding user to database
```SQL
INSERT INTO Users (UserName, UserPass, DateCreated) 
VALUES (?, ?, ?);
```

## Find user for login, this will find their username and pass for verification
```SQL
SELECT *
FROM Users 
WHERE UserName = (?);
```

## Selecting Book cover for the catalog page for a list
```SQL
SELECT BookTitle, BookImage
FROM Catalog;
```
## Get specific book page
```SQL
SELECT * 
FROM Catalog catalog
JOIN Chapters chapters
ON catalog.BookID = chapters.BookID;
```
## Get current user chapter in book page
```SQL
SELECT ChapterID
FROM UserBookStatus
WHERE UserID = (?);
```

## Adding to current session user favourites
```SQL
DELETE FROM UserBookStatus
WHERE UserID = (?);

INSERT INTO UserBookStatus (UserID, ChapterID)
VALUES (?, ?);
```