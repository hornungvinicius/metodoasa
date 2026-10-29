// Gera dist/ otimizado para hospedagem estática (Hostinger) e o zip para upload.
// Uso: npm install && npm run build
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { minify as minifyJs } from 'terser';
import { minify as minifyCss } from 'csso';
import { minify as minifyHtml } from 'html-minifier-terser';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const zipPath = join(root, 'metodoasa-site.zip');
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);

await rm(dist, { recursive: true, force: true });
await rm(zipPath, { force: true });
await mkdir(join(dist, 'js'), { recursive: true });

// CSS vai embutido no HTML: some uma requisição bloqueante antes da primeira pintura.
// Os caminhos relativos ao css/ passam a ser relativos à raiz.
const css = minifyCss(await readFile(join(root, 'css/styles.css'), 'utf8')).css.replaceAll('../fonts/', 'fonts/');

const js = (await minifyJs(await readFile(join(root, 'js/main.js'), 'utf8'), { compress: true, mangle: true })).code;
const jsName = `main.${hash(js)}.js`;
await writeFile(join(dist, 'js', jsName), js);
await cp(join(root, 'js/vendor'), join(dist, 'js/vendor'), { recursive: true });

let html = await readFile(join(root, 'index.html'), 'utf8');
html = html
  .replace('<link rel="stylesheet" href="css/styles.css">', `<style>${css}</style>`)
  .replace('src="js/main.js"', `src="js/${jsName}"`);
if (!html.includes('<style>') || !html.includes(jsName)) throw new Error('index.html não tem as referências esperadas de CSS/JS');
html = await minifyHtml(html, {
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeComments: true,
  minifyJS: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
});
await writeFile(join(dist, 'index.html'), html);

for (const dir of ['assets', 'fonts']) {
  await cp(join(root, dir), join(dist, dir), { recursive: true, filter: (src) => !src.endsWith('.gitkeep') });
}
for (const file of ['favicon.svg', 'apple-touch-icon.png']) await cp(join(root, file), join(dist, file));
for (const file of await readdir(join(root, 'public'))) await cp(join(root, 'public', file), join(dist, file));

execFileSync('zip', ['-r', '-9', '-q', zipPath, '.'], { cwd: dist });
console.log(`dist/ pronto e ${zipPath} gerado`);
