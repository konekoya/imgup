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

Add your imgur app client ID via the `config` command, see the [API docs](https://apidocs.imgur.com/) on how to obtain one.

> Note that if you didn't provide a client ID, a default one will be used. But you might encounter API limit issue very quick since the ID is shared for all users who use this CLI. See Q&A for more info about this.

```sh
$ imgup config
```

Upload the image via the `upload` command

```sh
$ imgup upload ./testData/big-cat.png

# The following output will be shown in your CLI once it's successfully uploaded
✔ Success
Image URL: https://i.imgur.com/mWbxxoM.png
Markdown: ![Big-cat image](https://i.imgur.com/mWbxxoM.png)
```

## Acknowledgement

Big thanks to [Rob Potter](https://unsplash.com/@robpotter) for the demo image

## Q&A

#### What happens to an uploaded image? Will it be deleted?

Generally speaking, no. Images are uploaded to imgur.com, and according to the [announcement](https://en.wikipedia.org/wiki/Imgur#Images), those images will never be deleted unless a deletion request is made.

#### Is it safe to use the default client ID provided by this app?

No. The imgur API we use has a rate limit, which can be quickly reached by users who use this CLI without adding their own imgur app ID. As a result, it's advisable to create your own imgur app ID to avoid exceeding the rate limit. But keep in mind, even with your own client ID added, you can still reach the rate limit if your usage exceeds their limit. From the imgur API [docs](https://apidocs.imgur.com/#intro):

> The Imgur API uses a credit allocation system to ensure fair distribution of capacity. Each application can allow approximately 1,250 uploads per day or approximately 12,500 requests per day. If the daily limit is hit five times in a month, then the app will be blocked for the rest of the month. The remaining credit limit will be shown with each requests response in the X-RateLimit-ClientRemaining HTTP header.

Also, an API upload will deduct 10 credits instead of 1, and this CLI uses upload under the hood for `$imgup upload` command:

> Unless otherwise noted, an API call deducts 1 credit from your allocation. However, uploads have a significantly higher computational cost on our back-end, and deduct 10 credits per call. All OAuth calls, such as refreshing tokens or authorizing users, do not deduct any credits.

## TODOs

- [x] Add error handling logic
- [x] Should output markdown image url instead of whole JSON
- [x] Better error handling
- [x] Publish to npm registry
- [x] Add GitHub action
- [ ] Linting

## License

MIT
