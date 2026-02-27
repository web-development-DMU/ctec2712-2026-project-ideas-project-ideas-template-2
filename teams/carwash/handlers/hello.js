export function hello(request) {
    const url = new URL(request.url);
    const myName = url.searchParams.get('name');
    return new Response(`Hello from hello.js. name=${myName}`);
}
