# Node HTTP2

`npm start`

This is an example code for using HTTP2 in Node.
The server serves `GET /` and no other route.
`favicon.ico` and `favicon.png` are served using HTTP2 Server Push when serving `GET /`.

Overall, upon `localhost:443` entry, a single HTTP request is made and a single TCP connection is established.
The favicon ICO and PNG files are sent over the permanent TCP connection using HTTP2 Server Push.

## To-Do

### Figure out why it breaks when the `img`s also refer to `favicon.ico`

There might be some sort of a race condition where the Server Push files are not provided
fast enough for the favicon loader which starts with parallel to the index HTML document.
