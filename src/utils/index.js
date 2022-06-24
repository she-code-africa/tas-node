import { exec } from 'child_process';

export function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout || stderr);
    });
  });
}

export function invokeRunner(url, language) {
  const command = `--engine ${language} --repo ${url}`
  return execShellCommand(`scripts/runner.sh ${command}`)
    .then(() => 'Pass')
    .catch((e) => {
      console.error('execution failed: ', e)
      if (e.code === 128) {
        return 'Unauthorized, Private Repo'
      }
      return 'Failed'
    })
}

export function cleanURL(url) {
  const _url = new URL(url)
  const paths = _url.pathname.split('/')
  return `${_url.origin}/${paths[1]}/${paths[2]}`
}