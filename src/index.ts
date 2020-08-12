
import path from 'path';
import fs from 'fs';
import { startService } from 'esbuild';
import {BuilderOptions, MessageError} from '@pika/types';
import { platform } from 'os';

const DEFAULT_ENTRYPOINT = 'browser';

export async function beforeJob({out}: BuilderOptions) {
  const srcDirectory = path.join(out, 'dist-web/');
  if (!fs.existsSync(srcDirectory)) {
    throw new MessageError(
      '"dist-web/" does not exist. "pika-plugin-esbuild" requires "plugin-build-web" to precede in pipeline.',
    );
  }
  const srcEntrypoint = path.join(out, 'dist-web/index.js');
  if (!fs.existsSync(srcEntrypoint)) {
    throw new MessageError('"dist-web/index.js" is the expected standard entrypoint, but it does not exist.');
  }
}

export function manifest(manifest, {options}: BuilderOptions) {
  if(options.entrypoint !== null) {
    let keys = options.entrypoint || [DEFAULT_ENTRYPOINT];
    if (typeof keys === 'string') {
      keys = [keys];
    }
    for (const key of keys) {
      manifest[key] = manifest[key] || 'dist-web/index.bundled.js';
    }
  }
}

export async function build({out, options, reporter}: BuilderOptions): Promise<void> {
  const service = await startService();
  const readFromWeb = path.join(out, 'dist-web', 'index.js');
  const writeToWeb = path.join(out, 'dist-web');
  const writeToWebBundled = path.join(writeToWeb, 'index.bundled.js');

  await service.build({
    strict: true,
    errorLimit: 0,
    write: true,
    entryPoints: [readFromWeb],
    outfile: writeToWebBundled,
    sourcemap: options.sourcemap === undefined ? true : options.sourcemap,
    minify: options.minify === undefined ? true: options.minify,
    platform: 'browser',
    ...options
  });

  reporter.created(writeToWebBundled);

  await service.stop();
}
