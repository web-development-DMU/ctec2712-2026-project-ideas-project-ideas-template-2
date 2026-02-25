console.log("Hello, world! This is the main JavaScript file for the PA team.");
function server(request) {
    return new Response("Hello, deno!");

}

Deno.serve();