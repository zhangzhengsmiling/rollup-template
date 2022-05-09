import path from 'path';
import fs from 'fs';
import { EXTENSIONS, CURRENT_WORKSPACE_DIRECTORY } from './constants'

// read all files of a directory
export const filesOf = (dir) => {
  const readFileOfDir = (dir, results) => {
    const list = fs.readdirSync(dir).map((item) => path.resolve(dir, item));
    list.forEach((_path) => {
      const stats = fs.statSync(_path);
      if (stats.isDirectory()) {
        readFileOfDir(path.resolve(_path), results);
      } else {
        results.push(_path);
      }
    });
  };
  const result = [];
  readFileOfDir(dir, result);
  return result;
};

export const pathResolve = (_path) => {
  const fullPath = path.resolve(CURRENT_WORKSPACE_DIRECTORY, _path);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    if (!stats.isDirectory()) return path;
    for (let i = 0; i < EXTENSIONS.length; i++) {
      const joinedPath = path.resolve(fullPath, `index${EXTENSIONS[i]}`);
      if (fs.existsSync(joinedPath)) {
        return joinedPath;
      }
    }
    throw new Error(`Can't find file or directory, ${fullPath}`);
  }
  throw new Error(`Can't find file or directory, ${fullPath}`);
};

export const createDirectoryIfNotExist = (p) => {
  const parsed = path.parse(p);
  fs.mkdirSync(parsed.dir, { recursive: true });
};
