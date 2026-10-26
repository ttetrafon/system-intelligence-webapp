import { serverRoot } from "../data/config";

/**
 *
 * @param {string} path : /path/to/resource
 * @returns the full server url for the given path
 */
export function serverRequestUrl(path: string): string {
  return `${serverRoot}${path}`;
}
