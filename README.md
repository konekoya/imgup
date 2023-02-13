# imgup

A NodeJS CLI tool for uploading images to imgur.com anonymously via [imgur API](https://apidocs.imgur.com/).

## Why

Have you ever wanted to link to an image from the Internet in your markdown but needed to go thur the tedious process of finding a place (usually a place like Dropbox or Google Drive) to upload it and obtain the image URL and finally use it in your markdown. But wait... what's the correct markdown syntax for displaying an image? 😬

Okay, maybe that's just me 😅 But with `imgup` CLI, you can just:

1. Locate the image and upload it from your terminal
2. Copy the ready-to-used markdown syntax and paste it right in your markdown document (See an example in the usage section)

## Installation

```sh
npm install -g imgup
```

## Usage

```sh
Usage: imgup [options] [command]

Options:
  -v, --version   output the current version
  -h, --help      display help for command

Commands:
  upload <image>  upload an image to imgur.com
  config          add your imgur client ID
  help [command]  display help for command
```

Here is an example of uploading an image from our test data directory:

1. Add your imgur app client ID via the `config` command, see the [API docs](https://apidocs.imgur.com/) on how to obtain one

```sh
$ imgup config
```

2. Upload the image via the `upload` command

```sh
$ imgup upload ./testData/big-cat.png

# The following output will be shown in your CLI once it's successfully uploaded
✔ Success
Image URL: https://i.imgur.com/mWbxxoM.png
Markdown: ![Big-cat image](https://i.imgur.com/mWbxxoM.png)
```

## Acknowledgement

Big thanks to [Rob Potter](https://unsplash.com/@robpotter) for the demo image

## TODOs

- [x] Add error handling logic
- [x] Should output markdown image url instead of whole JSON
- [x] Better error handling
- [x] Publish to npm registry
- [x] Add GitHub action
- [ ] Linting

## License

MIT
