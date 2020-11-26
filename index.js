#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const axios = require('axios');
const FormData = require('form-data');
const chalk = require('chalk');
const ora = require('ora');
const { program } = require('commander');
const { capitalize } = require('lodash/fp');
const packageJson = require('./package.json');

require('dotenv').config({ path: '.env' });

// This ID seems not necessary at all, but we're putting it in the request header anyway since it's
// documented in the official docs
const CLIENT_ID = process.env.IMGUR_CLIENT_ID;
program
  .version(packageJson.version)
  .option('-f, --file <string>', 'specify an image file path');
program.parse(process.argv);

const data = new FormData();
const file = program.file;

if (!file) {
  return console.log('You should provide a file via --file or -f');
}

const filePath = path.resolve(process.cwd(), file);
const baseName = path.basename(filePath);
const fileName = path.parse(baseName).name;

if (!fs.existsSync(filePath)) {
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
};

const spinner = ora('Uploading image to imgur...').start();

axios(config)
  .then((response) => {
    spinner.succeed('Success');
    console.log('Image URL:', chalk.bold(response.data.data.link));
    console.log(
      'Markdown:',
      `![${capitalize(fileName)} image](${response.data.data.link})`,
    );
  })
  .catch((error) => {
    spinner.succeed('Failed');
    console.log(error);
  });
