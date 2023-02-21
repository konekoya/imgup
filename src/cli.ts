import axios, { AxiosRequestConfig } from 'axios';
import chalk from 'chalk';
import { program } from 'commander';
import formData from 'form-data';
import inquirer, { Answers } from 'inquirer';
import capitalize from 'lodash/fp/capitalize.js';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';
import ConfigStore from './config-store.js';
import { API_URL, CONFIG_KEY, DEFAULT_CLIENT_ID } from './const.js';
import { UploadParams } from './types.js';
import { getFilename, getPackageMeta, isImage } from './utils.js';

const configStore = ConfigStore.getInstance();

export default function main() {
  const { version: appVersion } = getPackageMeta();

  program.version(appVersion, '-v, --version', 'output the current version');

  program
    .command('upload')
    .description('upload an image to imgur.com')
    .argument('<image>')
    .action(async (imagePath: string) => {
      const maybeLink = await uploadImage({
        clientId: getClientId(),
        imagePath: await resolveImagePath(imagePath),
      });

      if (maybeLink) {
        console.log('Image URL:', chalk.bold(maybeLink));
        console.log(
          'Markdown:',
          `![${capitalize(getFilename(imagePath))} image](${maybeLink})`,
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
}

// Load client ID from the configstore
function getClientId(): string {
  const clientId = configStore.has(CONFIG_KEY);
  if (!clientId) {
    console.log(
      chalk.yellow(
        'No client ID found in your config. Using a default client ID. You might encounter API limit by using this one.',
      ),
    );

    console.log(
      chalk.yellow(
        'See https://github.com/konekoya/imgup/blob/master/README.md for more info.',
      ),
    );

    // imgur API has a limit for each client, and this default client ID is shared
    // by users who use our CLI and so it's very like to hit the limit very quick
    return DEFAULT_CLIENT_ID;
  }

  return configStore.get(CONFIG_KEY);
}

// Ask users for the client ID, and persist in the configstore locally
// the config can be found in `~/.config/configstore/imgup.json`
function configureClientId() {
  inquirer
    .prompt([
      {
        name: 'clientId',
        message: `Enter your client ID:`,
        validate: validateClientId,
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

async function validateClientId(input: string) {
  if (input.trim() === '') {
    return 'Please enter a correct client ID';
  }
  return true;
}

// Upload image to the services via the API endpoint, the returned data contains
// the like to the image and the filename from the image file
async function uploadImage({
  imagePath,
  clientId,
}: UploadParams): Promise<string | void> {
  const data = new formData();
  const fileName = getFilename(imagePath);
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
    return res.data.data.link;
  } catch (error) {
    spinner.fail(
      chalk.red("Oops, something went wrong! We're able to upload your image."),
    );
    console.log(chalk.yellow('Did you use a valid Client ID?'));
    console.dir(error, { depth: Infinity });
  }
}

// See if the image path is valid
async function resolveImagePath(imagePath: string): Promise<string> {
  const resolvedPath = path.resolve(process.cwd(), imagePath);

  if (!fs.existsSync(resolvedPath)) {
    console.log(`${resolvedPath} doesn't exist!`);
    process.exit(1);
  }

  if (await isImage(resolvedPath)) {
    return resolvedPath;
  } else {
    console.log(`${resolvedPath} is not an image!`);
    process.exit(1);
  }
}
