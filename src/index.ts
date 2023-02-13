#!/usr/bin/env node

import axios, { AxiosRequestConfig } from 'axios';
import chalk from 'chalk';
import formData from 'form-data';
import capitalize from 'lodash/fp/capitalize.js';
import path from 'path';
import { createProgram } from './cli.js';
import { createConfigStore } from './utils.js';
import inquirer, { Answers } from 'inquirer';
import fs from 'node:fs';
import { API_URL, CONFIG_KEY } from './consts.js';
import ora from 'ora';
import { UploadParams, UploadResult } from './types.js';

const configStore = createConfigStore();

// CLI
const program = createProgram();

program
  .command('upload')
  .description('upload an image to imgur.com')
  .argument('<image>')
  .action(async (imagePath: string) => {
    const maybeResult = await uploadImage({
      clientId: getClientId(),
      imagePath: resolveImagePath(imagePath),
    });

    if (maybeResult) {
      const result = maybeResult;
      console.log('Image URL:', chalk.bold(result.imageLink));
      console.log(
        'Markdown:',
        `![${capitalize(result.filename)} image](${result.imageLink})`,
      );
      process.exit(0);
    } else {
      process.exit(1);
    }
  });

program
  .command('config')
  .description('add your imgur client ID')
  .action(() => configureClientId());

program.parse(process.argv);

// Load client ID from the configstore
function getClientId(): string {
  const clientId: string | undefined = configStore.get(CONFIG_KEY);
  if (clientId === undefined) {
    console.log(
      chalk.red(
        'No client ID found in your config. Run `imgup config` to add one.',
      ),
    );
    process.exit(1);
  }

  return clientId;
}

// Upload image to the services via the API endpoint, the returned data contains
// the like to the image and the filename from the image file
async function uploadImage({
  imagePath,
  clientId,
}: UploadParams): Promise<UploadResult | void> {
  const data = new formData();
  const baseName = path.basename(imagePath);
  const fileName = path.parse(baseName).name;
  data.append('image', fs.createReadStream(imagePath));
  data.append('name', fileName);
  data.append('title', fileName);

  const config = {
    method: 'post',
    url: API_URL,
    headers: {
      Authorization: `Client-ID ${clientId}`,
      ...data.getHeaders(),
    },
    data: data,
  } as AxiosRequestConfig;

  const spinner = ora('Uploading image to imgur.com').start();
  try {
    const res = await axios(config);
    spinner.succeed('Success');
    return {
      imageLink: res.data.data.link,
      filename: fileName,
    };
  } catch (error) {
    spinner.fail(
      chalk.red("Oops, something went wrong! We're able to upload your image."),
    );
    console.log(chalk.yellow('Did you use a valid Client ID?'));
  }
}

// See if the image path is valid
function resolveImagePath(imagePath: string): string {
  const resolvedPath = path.resolve(process.cwd(), imagePath);

  if (!fs.existsSync(resolvedPath)) {
    console.log(`${resolvedPath} doesn't exist!`);
    process.exit(1);
  }

  return resolvedPath;
}

// Ask users for the client ID, and persist in the configstore locally
// the config can be found in `~/.config/configstore/imgup.json`
function configureClientId() {
  inquirer
    .prompt([
      {
        name: 'clientId',
        message: `Enter your client ID:`,
        validate: async (input) => {
          if (input.trim() === '') {
            return 'Please enter a correct client ID';
          }
          return true;
        },
      },
    ])
    .then((answers: Answers) => {
      configStore.set(CONFIG_KEY, answers.clientId.trim());
    })
    .catch((error: Error) => {
      console.log(error);
      process.exit(1);
    });
}
