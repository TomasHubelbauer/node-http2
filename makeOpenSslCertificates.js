import getIp from './getIp.js';
import exec from './exec.js';

export default async function makeOpenSslCertificates() {
  const ip = await getIp();
  await exec(`openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout ${ip}-key.pem -out ${ip}.pem`, 'certificates');
}
