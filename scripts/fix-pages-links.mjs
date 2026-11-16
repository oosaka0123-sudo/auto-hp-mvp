import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const root = 'dist';
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (path.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      await writeFile(path, html.replace(/(href|src)="\/(?!\/|auto-hp-mvp\/)/g, '$1="/auto-hp-mvp/'));
    }
  }
}
await walk(root);
