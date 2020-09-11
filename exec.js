import child_process from 'child_process';
import util from 'util';

const childProcessExec = util.promisify(child_process.exec);

export default async function exec(/** @type {string} */ command, /** @type {string} */ cwd) {
  try {
    return await childProcessExec(command, { cwd });
  }
  catch (error) {
    return error;
  }
}
