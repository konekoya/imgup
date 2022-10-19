# imgup

Upload images to imgur anonymously via [imgur API](https://apidocs.imgur.com/). Useful when you're working with Markdown. The output result can be used directly in the Markdown.

## Usage

```sh
Usage: imgup [options]

Options:
  -f, --file <string>  specify an image file path
  -h, --help           display help for command
```

## Example

```sh
imgup --file ./a/path/to/an/image.jpg

# The following output will be shown in your CLI
✔ Success
Image URL: https://i.imgur.com/example.png
Markdown: ![Example image](https://i.imgur.com/example.png)
```

## TODOs

- [x] Add error handling logic
- [x] Should output markdown image url instead of whole JSON
- [x] Better error handling
- [x] Publish to npm registry
- [ ] Add GitHub action
- [ ] Linting

License

MIT
