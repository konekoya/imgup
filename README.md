# imgup

Upload images to imgur anonymously via [imgur API](https://apidocs.imgur.com/)

> ⚠️&nbsp;&nbsp;This package is not released on npm

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

# Response
✔ Success
Image URL: https://i.imgur.com/example.png
Markdown: ![Example image](https://i.imgur.com/example.png)
```

## TODOs

- [x] Add error handling logic
- [x] Should output markdown image url instead of whole JSON
- [ ] Linting
- [ ] Better error handling
- [ ] Publish to npm registry

License

MIT
