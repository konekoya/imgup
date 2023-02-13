import { Command, program } from 'commander';
import { getPackageMeta } from './utils.js';

export function createProgram(): Command {
  const { version: appVersion } = getPackageMeta();
  program.version(appVersion, '-v, --version', 'output the current version');
  return program;
}
