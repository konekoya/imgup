# imgup

Upload images to imgur anonymously via [imgur API](https://apidocs.imgur.com/). Useful when you're working with Markdown. The output result can be used directly in the Markdown.

## Installation

```sh
npm install -g imgup
```

## Usage

```sh
Usage: imgup [options]

Options:
  -f, --file <string>  specify an image file path to upload to imgur
  -v, --version        output the current version
  -h, --help           display help for command
```

To upload an image from our test data directory:

```sh
imgup --file ./testData/big-cat.png

# The following output will be shown in your CLI
✔ Success
Image URL: https://i.imgur.com/vZq82v6.png
Markdown: ![Bit-cat image](https://i.imgur.com/vZq82v6.png)
```

## Acknowledgement

Big thanks to [Rob Potter](https://unsplash.com/@robpotter) for the test data image

## TODOs

- [x] Add error handling logic
- [x] Should output markdown image url instead of whole JSON
- [x] Better error handling
- [x] Publish to npm registry
- [ ] Add GitHub action
- [ ] Linting

## License

MIT
