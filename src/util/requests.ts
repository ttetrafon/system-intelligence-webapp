/**
 *
 * @param {string} path : /path/to/resource
 * @returns the full server url for the given path
 */
export function serverRequestUrl(path: string): string {
  console.log(`request path: ${import.meta.env.VITE_SERVER_URL}${path}`);
  return `${import.meta.env.VITE_SERVER_URL}${path}`;
}
