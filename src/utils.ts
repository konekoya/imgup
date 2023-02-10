import fs from 'fs';
import axios, { AxiosRequestConfig } from 'axios';
import ora from 'ora';
import Configstore from 'configstore';
import { PackageMeta } from './types.js';

export async function uploadImage(
  config: AxiosRequestConfig,
): Promise<string | undefined> {
  const spinner = ora('Uploading image to imgur.com').start();
  try {
    const res = await axios(config);
    spinner.succeed('Success');
    return res.data.data.link;
  } catch (error) {
    spinner.fail('Failed');
    console.log(error);
    console.dir(error, { depth: Infinity });
  }
}

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
