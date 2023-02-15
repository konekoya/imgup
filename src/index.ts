#!/usr/bin/env node

import chalk from 'chalk';
import capitalize from 'lodash/fp/capitalize.js';
import {
  configureClientId,
  createProgram,
  getClientId,
  resolveImagePath,
  uploadImage,
} from './cli.js';
import { getFilename } from './utils.js';

const program = createProgram();

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
