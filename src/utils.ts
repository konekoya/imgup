import { fileTypeFromBuffer } from 'file-type';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { PackageMeta } from './types.js';

export function getPackageMeta(): PackageMeta {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const packagePath = path.join(__dirname, '../', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  return {
    name: packageJson.name,
    version: packageJson.version,
  };
}

export async function isImage(path: string) {
  const buffer = fs.readFileSync(path);

  // To keep this app as small as possible, I've decided just to support a handful of image types here
  // Here is a reference link to imgur.com where all supported file types are listed, we might want to
  // extend this in the future
  // https://help.imgur.com/hc/en-us/articles/115000083326-What-files-can-I-upload-Is-there-a-size-limit-
  const imageExtensions = new Set(['jpg', 'png', 'gif', 'webp', 'bmp']);
  const result = await fileTypeFromBuffer(buffer);
  return result && imageExtensions.has(result.ext);
}

export function getFilename(filePath: string) {
  const baseName = path.basename(filePath);
  const fileName = path.parse(baseName).name;
  return fileName;
}
