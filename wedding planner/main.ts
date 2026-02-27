import { Application, Router, Database } from "./deps.ts";

const app = new Application();
const router = new Router();
const db = new Database("wedding.db");

// This sends the guest list to the website
router.get("/api/guests", (ctx) => {
    const guests = db.prepare("SELECT * FROM guests").all();
    ctx.response.body = guests;
});

app.use(router.routes());
console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
