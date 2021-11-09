#!/usr/bin/env node

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import chalk from 'chalk';
import { program } from 'commander';
import * as dotenv from 'dotenv';
import formData from 'form-data';
import fs from 'fs';
import capitalize from 'lodash/fp/capitalize.js';
import ora from 'ora';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// This ID seems not necessary at all, but we're putting it in the request header anyway since it's
// documented in the official docs
const CLIENT_ID = process.env.IMGUR_CLIENT_ID;

program.option('-f, --file <string>', 'specify an image file path');
program.parse(process.argv);
const options = program.opts();

const data = new formData();
const file = options.file as string;

if (!file) {
  console.log('You should provide a file via --file or -f');
  console.log();
  program.outputHelp();
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), file);
const baseName = path.basename(filePath);
const fileName = path.parse(baseName).name;

if (!fs.existsSync(filePath)) {
  console.log(`${filePath} doesn't exist!`);
  process.exit(1);
}

data.append('image', fs.createReadStream(filePath));
data.append('name', fileName);
data.append('title', fileName);

const config = {
  method: 'post',
  url: 'https://api.imgur.com/3/upload',
  headers: {
    Authorization: `Client-ID ${CLIENT_ID}`,
    ...data.getHeaders(),
  },
  data: data,
} as AxiosRequestConfig;

const spinner = ora('Uploading image to imgur...').start();

axios(config)
  .then((response: AxiosResponse) => {
    spinner.succeed('Success');
    console.log('Image URL:', chalk.bold(response.data.data.link));
    console.log(
      'Markdown:',
      `![${capitalize(fileName)} image](${response.data.data.link})`,
    );
  })
  .catch((error: AxiosError) => {
    spinner.fail('Failed');
    console.log(error);
  });
