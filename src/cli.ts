import { Command, program } from 'commander';
import { getPackageVersion } from './utils.js';

export function createProgram(): Command {
  const appVersion = getPackageVersion();
  program.version(appVersion, '-v, --version', 'output the current version');
  // program.parse(process.argv);
  return program;
}
