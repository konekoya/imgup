import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import axios, { AxiosRequestConfig } from 'axios';
import ora from 'ora';
import Configstore from 'configstore';

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

export function getPackageVersion(): string {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return packageJson.version as string;
}

export function createConfigStore() {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return new Configstore(packageJson.name);
}
