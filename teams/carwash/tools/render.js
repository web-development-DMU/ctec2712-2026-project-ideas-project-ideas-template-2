export function render(content, status=200) {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <title>Car Wash Booking System</title>
        </head>

        <body>
            <header>
                <section id="container">
                    <a href="/" class="btn" id="home-button">Home</a>
                    <a href="/" style="float: right" class="btn" id="user_profile-button">User Profile</a>
                </section>

                <h1>Car Wash Booking System</h1>
            </header>

            <main>
                ${content}
            </main>
            <footer></footer>

            <br>
        </body>
    </html>
    `

    const headers = new Headers({"content-type": "text/html"})
    return new Response(html, {headers, status})
}
