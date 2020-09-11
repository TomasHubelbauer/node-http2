import os from 'os';

export default async function getIp() {
  const interfaces = os.networkInterfaces()['lo0'];
  if (!interfaces) {
    throw new Error(`The lo0 network interface was not found. This is hard-coded to macOS localhost. Adjust to your system's value.`);
  }

  // Note that `interface` is a strict mode reserved keyword so we cannot use it
  const _interface = interfaces.find(i => i.family === 'IPv4');
  if (!_interface) {
    throw new Error(`The lo0 network interface was found but it has no IPv4 family entry. Adjust to your system's value.`);
  }

  return _interface.address;
}
