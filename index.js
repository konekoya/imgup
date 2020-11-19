#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const axios = require('axios');
const FormData = require('form-data');
const { program } = require('commander');
const jsom = require('jsome');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// This ID seems not necessary at all, but we're putting it in the request header anyway since it's
// documented in the official docs
const CLIENT_ID = process.env.IMGUR_CLIENT_ID;
program.option('-f, --file <string>', 'specify an image file path');
program.parse(process.argv);

const data = new FormData();
const file = program.file;
const filePath = path.resolve(process.cwd(), file);
const baseName = path.basename(filePath);
const fileName = path.parse(baseName).name;
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

axios(config)
  .then((response) => {
    jsom(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
