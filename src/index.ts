#!/usr/bin/env node

import { AxiosRequestConfig } from 'axios';
import chalk from 'chalk';
import formData from 'form-data';
import capitalize from 'lodash/fp/capitalize.js';
import path from 'path';
import { createProgram } from './cli.js';
import { createConfigStore, uploadImage } from './utils.js';
import dotenv from 'dotenv';
import inquirer, { Answers } from 'inquirer';
import fs from 'node:fs';
import { API_URL, CONFIG_KEY } from './consts.js';

const configStore = createConfigStore();
dotenv.config();
const program = createProgram();
program
  .command('upload')
  .argument('<image>', 'specify an image file path to upload to imgur')
  .action(async (imagePath: string) => {
    const clientId: string | undefined = configStore.get(CONFIG_KEY);

    if (clientId === undefined) {
      console.log(
        chalk.red(
          'No client ID found in your config. Run `imgup config` to add one.',
        ),
      );
      process.exit(1);
    }

    console.log(`Using cilent ID of: ${clientId}`);

    const resolvedPath = path.resolve(process.cwd(), imagePath);

    if (!fs.existsSync(resolvedPath)) {
      console.log(`${resolvedPath} doesn't exist!`);
      process.exit(1);
    }

    const data = new formData();
    const baseName = path.basename(resolvedPath);
    const fileName = path.parse(baseName).name;
    data.append('image', fs.createReadStream(resolvedPath));
    data.append('name', fileName);
    data.append('title', fileName);

    const config = {
      method: 'post',
      url: API_URL,
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        ...data.getHeaders(),
      },
      data: data,
    } as AxiosRequestConfig;

    const maybeLink = await uploadImage(config);

    if (maybeLink) {
      console.log('Image URL:', chalk.bold(maybeLink));
      console.log(
        'Markdown:',
        `![${capitalize(fileName)} image](${maybeLink})`,
      );
      process.exit(0);
    } else {
      process.exit(1);
    }
  });

program.command('config').action(() => {
  inquirer
    .prompt([
      {
        name: 'clientId',
        message: `Enter your client ID:`,
      },
    ])
    .then((answers: Answers) => {
      configStore.set('clientId', answers.clientId.trim());
    })
    .catch((error: Error) => {
      console.log(error);
    });
});

program.parse(process.argv);
// const file = options.file as string;

// if (!file) {
//   console.log('You should provide a file via --file or -f');
//   console.log();
//   program.outputHelp();
//   process.exit(1);
// }

// const filePath = path.resolve(process.cwd(), file);

// if (!fs.existsSync(filePath)) {
//   console.log(`${filePath} doesn't exist!`);
//   process.exit(1);
// }

// const data = new formData();
// const baseName = path.basename(filePath);
// const fileName = path.parse(baseName).name;
// data.append('image', fs.createReadStream(filePath));
// data.append('name', fileName);
// data.append('title', fileName);

// const config = {
//   method: 'post',
//   url: 'https://api.imgur.com/3/upload',
//   headers: {
//     Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
//     ...data.getHeaders(),
//   },
//   data: data,
// } as AxiosRequestConfig;

// const maybeLink = await uploadImage(config);

// if (maybeLink) {
//   console.log('Image URL:', chalk.bold(maybeLink));
//   console.log('Markdown:', `![${capitalize(fileName)} image](${maybeLink})`);
//   process.exit(0);
// } else {
//   process.exit(1);
// }
