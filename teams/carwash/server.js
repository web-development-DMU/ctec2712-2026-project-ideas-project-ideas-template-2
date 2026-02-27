import { createUserController, userListController } from "./controllers/user.js";
import { hello } from "./handlers/hello.js";
import { world } from "./handlers/world.js";

export function server(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path == "/" && request.method == "GET") return userListController(request);
    if (path == "/" && request.method == "POST") return createUserController(request);
    if (path == "/hello" && request.method == "GET") return hello(request);
    if (path == "/world" && request.method == "GET") return world(request);

    return new Response("Hello from server.js");
}
