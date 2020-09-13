import http2 from 'http2';
import makeOptions from './makeOptions.js';
import getIp from './getIp.js';
import fs from 'fs';

void async function() {
  const favicon = await fs.promises.readFile('favicon.png');

  http2
    .createSecureServer(await makeOptions(), (request, response) => {
      const headers = request.headers;
      const stream = response.stream;

      const route = headers[':method'] + ' ' + headers[':path'];
      if (route !== 'GET /') {
        stream.respond({ 'content-type': 'text/plain; charset=utf-8', ':status': 404 });
        stream.end(`This server only responds to 'GET /' not '/${route}'!`);
        return;
      }

      stream.pushStream({ ':path': '/favicon.ico' }, (error, stream) => {
        stream.respond({ 'content-type': 'image/png', ':status': 200 });
        stream.end(favicon);
      });
  
      stream.pushStream({ ':path': '/favicon.png' }, (error, stream) => {
        stream.respond({ 'content-type': 'image/png', ':status': 200 });
        stream.end(favicon);
      });
  
      stream.respond({ 'content-type': 'text/html; charset=utf-8', ':status': 200 });

      // TODO: Figure out why it breaks when these images refer to favicon.ico - race condition with favicon loader?
      stream.end(`<title>Node HTTP2</title><img src="favicon.png" /><img src="favicon.png" /><img src="favicon.png" />`);
    })
    .listen(443, async () => console.log(`https://${await getIp()}`));
}()
