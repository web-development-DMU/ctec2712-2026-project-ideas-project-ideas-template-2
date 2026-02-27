import { getUsers } from "../models/user.js";
import { createUser } from "../models/user.js";
import { render } from "../tools/render.js";
import { userListView } from "../views/users/index.js";

export function userListController(request) {
    const users = getUsers();
    const html = userListView(users);
    return render(html);
}

export async function createUserController(request) {
    const formData = await request.formData();
    const name = formData.get('name');

    createUser(name);
    const headers = new Headers({"location": "/"});
    return new Response(null, {headers, status: 303});
}
