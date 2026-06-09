import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src', 'templates');
const target = path.join(root, 'dist', 'templates');
const schemaSource = path.join(root, 'schema');
const schemaTarget = path.join(root, 'dist', 'schema');

await mkdir(path.dirname(target), { recursive: true });
await cp(source, target, { recursive: true, force: true });
await cp(schemaSource, schemaTarget, { recursive: true, force: true });
