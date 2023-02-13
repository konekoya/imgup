import fs from 'node:fs';
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
