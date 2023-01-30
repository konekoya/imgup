import { Command, program } from 'commander';
import { getPackageVersion } from './utils.js';

export function createProgram(): Command {
  const appVersion = getPackageVersion();

  program.option(
    '-f, --file <string>',
    'specify an image file path to upload to imgur',
  );
  program.version(appVersion, '-v, --version', 'output the current version');
  program.parse(process.argv);
  return program;
}
