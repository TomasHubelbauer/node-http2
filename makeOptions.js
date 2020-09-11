import fs from 'fs';
import getIp from './getIp.js';
import makeOpenSslCertificates from './makeOpenSslCertificates.js';

export default async function makeOptions(attempt = true) {
  // Create the `certificates` directory if it does not exist
  try {
    await fs.promises.mkdir('certificates');
  }
  catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }

  // Read the certificate files for the lo0 interface's IPv4 address
  const ip = await getIp();
  try {
    return {
      cert: await fs.promises.readFile(`certificates/${ip}.pem`),
      key: await fs.promises.readFile(`certificates/${ip}-key.pem`),
    };
  }
  catch (error) {
    // Throw if an unexpected error has occured
    if (error.code !== 'ENOENT') {
      throw error;
    }

    try {
      // Attempt to make the certificates before we give up unless we already tried
      if (attempt) {
        await makeOpenSslCertificates();
        return makeOptions(false);
      }

      throw new Error(`Certificates were still not made even though the attempt has been tried.`);
    }
    // Instruct the user on how to make the certificates themselves since the automated measures have failed
    catch (error) {
      const message = [
        `Certificates for ${ip} (the ${ip}.pem and ${ip}-key.pem files) are not in the certificates directory.`,
        `Use "openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout ${ip}-key.pem -out ${ip}.pem" or "mkcert ${ip}" to generate them.`,
        'OpenSSL comes with macOS and most Linux distributions, on Windows you need to install it. mkcert you can find at https://github.com/FiloSottile/mkcert.',
      ].join('\n');
      throw new Error(message);
    }
  }
}
