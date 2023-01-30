#!/usr/bin/env node

import { AxiosRequestConfig } from 'axios';
import chalk from 'chalk';
import formData from 'form-data';
import fs from 'fs';
import capitalize from 'lodash/fp/capitalize.js';
import path from 'path';
import { createProgram } from './cli.js';
import { uploadImage } from './utils.js';

const program = createProgram();
const options = program.opts();
const file = options.file as string;

if (!file) {
  console.log('You should provide a file via --file or -f');
  console.log();
  program.outputHelp();
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), file);

if (!fs.existsSync(filePath)) {
  console.log(`${filePath} doesn't exist!`);
  process.exit(1);
}

const data = new formData();
const baseName = path.basename(filePath);
const fileName = path.parse(baseName).name;
data.append('image', fs.createReadStream(filePath));
data.append('name', fileName);
data.append('title', fileName);

const config = {
  method: 'post',
  url: 'https://api.imgur.com/3/upload',
  headers: {
    ...data.getHeaders(),
  },
  data: data,
} as AxiosRequestConfig;

const maybeLink = await uploadImage(config);

if (maybeLink) {
  console.log('Image URL:', chalk.bold(maybeLink));
  console.log('Markdown:', `![${capitalize(fileName)} image](${maybeLink})`);
  process.exit(0);
} else {
  process.exit(1);
}
