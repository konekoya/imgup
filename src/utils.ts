import fs from 'node:fs';
import path from 'node:path';
import { fileTypeFromBuffer } from 'file-type';
import Configstore from 'configstore';
import { PackageMeta } from './types.js';

export function getPackageMeta(): PackageMeta {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return {
    name: packageJson.name,
    version: packageJson.version,
  };
}

export function createConfigStore() {
  const { name: appName } = getPackageMeta();
  return new Configstore(appName);
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
