#!/usr/bin/env node

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import chalk from 'chalk';
import { program } from 'commander';
import formData from 'form-data';
import fs from 'fs';
import { capitalize } from 'lodash/fp';
import ora from 'ora';
import path from 'path';

program.option('-f, --file <string>', 'specify an image file path');
program.parse(process.argv);

const data = new formData();
const file = program.file as string;

if (!file) {
  // @ts-ignore
  return console.log('You should provide a file path via `--file` flag');
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
  headers: data.getHeaders(),
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
