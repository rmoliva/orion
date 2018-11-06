import Bluebird from 'bluebird';
import fs from 'fs';
import * as R from 'ramda';
import YAML from 'yaml';

const writeFile: (filePath: string, content: string) => Bluebird<string> =
(filePath, content) => new Bluebird((resolve, reject) => {
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve(content);
    }
  });
});

const readFile: (filePath: string) => Bluebird<string> =
(filePath) => {
  return new Bluebird((resolve: any, reject: any) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const unlinkFile: (path: string) => Bluebird<string> =
(path) => {
  return new Bluebird((resolve: any, reject: any) => {
    fs.unlink(path, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(path);
          return;
        }
        reject(err);
      } else {
        resolve(path);
      }
    });
  });
};

export {
  readFile,
  writeFile,
  unlinkFile,
};
