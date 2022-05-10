import * as path from 'path';
import * as fs from 'fs';
import { EXTENSIONS, CURRENT_WORKSPACE_DIRECTORY } from './constants'

/**
 * use for recursion functor
 * @param  dir               directory of file
 * @return     all files that are in directory
 */
const readFileOfDir = (dir: string, results: string[]) => {
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

/**
 * read all files of a directory
 * @param  dir               path of directory
 * @return     all files that are in directory
 */
export const filesOf = (dir: string) => {
  const result: string[] = [];
  readFileOfDir(dir, result);
  return result;
};

/**
 * []
 * @param  CURRENT_WORKSPACE_DIRECTORY               [description]
 * @param  _path                                     [description]
 * @return                             [description]
 */
export const pathResolve = (_path: string) => {
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

export const createDirectoryIfNotExist = (p: string) => {
  const parsed = path.parse(p);
  fs.mkdirSync(parsed.dir, { recursive: true });
};
