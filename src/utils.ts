import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import axios, { AxiosRequestConfig } from 'axios';
import ora from 'ora';

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
  }
}

export function getPackageVersion(): string {
  // There are some crazy issues with the TS and the new module system. So instead of importing the
  // package.json, we will just read it via the fs module... 😢
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const packageJSONFilePath = path.resolve(__dirname, '../package.json');
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONFilePath, 'utf8'));
  return packageJSON.version as string;
}
