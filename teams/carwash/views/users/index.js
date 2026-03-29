export function userListView() {
    return `
    <h2>Login Page</h2>
    <form method="POST">
        <label>Username:</label>
        <input id="name" name="name">

        <br><br>

        <label>Password:</label>
        <input id="password" name="password">

        <br><br>

        <input type="submit">
    </form>
    `;
}
