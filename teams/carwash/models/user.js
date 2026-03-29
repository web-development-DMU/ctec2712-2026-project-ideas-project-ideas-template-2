import { db } from "../tools/db.js";

export function getUsers() {
    return db.prepare("SELECT id, name FROM users;").all();
}

export function createUser(name) {
    db.prepare("INSERT INTO users (name) VALUES (?)").run(name);
}
