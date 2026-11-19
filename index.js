import { readFile, stat } from 'node:fs/promises';
import { readFileSync, watch } from 'node:fs';
import Schema from '@deepseek-ai/schemastery';
import { fileURLToPath } from 'node:url';
import { dragonMaidSvg } from './artwork.js';
import { STAGES, safeAssetStage } from './logic.js';

// Only volatile fields are exposed by the native settings service. Keep the
// illustration object volatile as a whole: nesting volatile children is invalid.
const locale = language => JSON.parse(readFileSync(new URL(`./locale/${language}.json`, import.meta.url), 'utf8'));
const illustration = () => Schema.string().max(8 * 1024 * 1024 + 128).pattern(/^(?:|https?:\/\/(?![^/?#]*@)[^\s]+|data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=\r\n]+)$/i).default('');
export const Config = Schema.object({
  name: Schema.string().max(80).default('').volatile(),
  character: Schema.union(['auto', 'dragon', 'claude', 'deepseek']).default('auto').volatile(),
  followModels: Schema.array(Schema.string().min(1).max(512)).max(100).default(['gpt*', 'o1*', 'o3*', 'o4*', 'claude*', 'deepseek*']).volatile(),
  illustrations: Schema.object(Object.fromEntries(STAGES.map(stage => [stage, illustration()]))).volatile(),
  width: Schema.natural().min(140).max(420).default(220).volatile(),
  visible: Schema.boolean().default(true).volatile(),
  showCaption: Schema.boolean().default(true).volatile(),
  stage: Schema.union(['auto', ...STAGES]).default('auto').volatile(),
  divineGlow: Schema.boolean().default(true).volatile(),
}).i18n({ en: locale('en').config, zh: locale('zh').config });

// Config is discovered automatically by dsh-settings; its native controller
// exposes plain values to the browser via remote.settings.describe(). No second
// settings store, profile writes, business service or model-facing tool is needed.
export const inject = ['webServer'];
export async function apply(ctx) {
  const clients = new Set();
  const assetDir = new URL('./assets/', import.meta.url);
  // The host's own request gate: `undefined` admits the request, a status code
  // (401 / 403) refuses it. Looked up per request and optionally, so a host that
  // exposes no `connection` service still loads the plugin — there is nothing to
  // enforce on such a host, and requiring the service would keep it from starting.
  const rejection = request => ctx.get?.('connection')?.requestRejection?.(request);
  const revision = () => String(Date.now());
  let currentRevision = revision();
  let debounce;
  async function manifest() {
    const assets = {};
    for (const stage of STAGES) {
      const info = await stat(new URL(`${stage}.png`, assetDir)).catch(() => null);
      assets[stage] = { kind: info?.isFile() ? 'illustration' : 'original-vector', bytes: info?.size ?? null };
    }
    return { version: currentRevision, assets };
  }
  const notify = () => {
    currentRevision = revision();
    for (const response of clients) response.write(`data: ${JSON.stringify({ version: currentRevision })}\n\n`);
  };
  ctx.effect(() => {
    const watcher = watch(fileURLToPath(assetDir), (_event, name) => {
      if (!name || !/^(low|medium|high|xhigh|max)\.png$/.test(String(name))) return;
      clearTimeout(debounce);
      debounce = setTimeout(notify, 150);
    });
    const heartbeat = setInterval(() => {
      for (const response of clients) response.write(': heartbeat\n\n');
    }, 25000);
    heartbeat.unref?.();
    return () => {
      clearTimeout(debounce);
      clearInterval(heartbeat);
      watcher.close();
      for (const response of clients) response.end();
      clients.clear();
    };
  });
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix', path: '/dragon-maid-pet/',
    async handler(req, res) {
      const refused = rejection(req);
      if (refused !== undefined) {
        res.writeHead(refused, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(req.method === 'HEAD' ? undefined : JSON.stringify({
          error: 'This request came from an untrusted origin or needs a DSH login. / 请求来自不受信任的来源，或需要先登录 DSH。',
        }));
        return;
      }
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;
      }
      const pathname = new URL(req.url, 'http://localhost').pathname;
      const head = req.method === 'HEAD';
      if (pathname === '/dragon-maid-pet/events') {
        res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'X-Accel-Buffering': 'no' });
        if (head) { res.end(); return; }
        clients.add(res);
        res.write(`data: ${JSON.stringify({ version: currentRevision })}\n\n`);
        res.on('close', () => clients.delete(res));
        return;
      }
      if (pathname === '/dragon-maid-pet/manifest') {
        const data = JSON.stringify(await manifest());
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(head ? undefined : data); return;
      }
      const stage = safeAssetStage(pathname);
      if (!stage) { res.writeHead(404); res.end(); return; }
      const png = await readFile(new URL(`${stage}.png`, assetDir)).catch(() => null);
      const data = png ?? Buffer.from(dragonMaidSvg(stage));
      res.writeHead(200, { 'Content-Type': png ? 'image/png' : 'image/svg+xml; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Content-Length': data.length });
      res.end(head ? undefined : data);
    },
  }));
}
