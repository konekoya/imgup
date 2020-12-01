#!/usr/bin/env node

import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import fs from 'fs';
import path from 'path';
import formData from 'form-data';
import chalk from 'chalk';
import ora from 'ora';
import { program } from 'commander';
import { capitalize } from 'lodash/fp';

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// This ID seems not necessary at all, but we're putting it in the request header anyway since it's
// documented in the official docs
const CLIENT_ID = process.env.IMGUR_CLIENT_ID;

program.option('-f, --file <string>', 'specify an image file path');
program.parse(process.argv);

const data = new formData();
const file = program.file;

if (!file) {
  // @ts-ignore
  return console.log('You should provide a file via --file or -f');
}

const filePath = path.resolve(process.cwd(), file);
const baseName = path.basename(filePath);
const fileName = path.parse(baseName).name;

if (!fs.existsSync(filePath)) {
  // @ts-ignore
  return console.log(`${filePath} doesn't exist!`);
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
