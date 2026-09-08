/* Downloads portfolio media from the public Google Drive "PORTFOLIO" folder.
 *
 *   images  -> assets/img/<id>.<ext>      (full-res originals)
 *   posters -> assets/poster/<id>.jpg     (video thumbnail frames)
 *
 * Videos themselves are NOT downloaded — they stream from Drive's iframe
 * player at runtime. Re-runnable: existing files are skipped.
 *
 *   node scripts/fetch-assets.mjs
 */
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = join(ROOT, 'assets', 'img');
const POSTER_DIR = join(ROOT, 'assets', 'poster');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// Full-res images: [driveId, extension]
const IMAGES = [
  // Gas Station renders (png)
  ['16cxcPdAVEOEdu4zyCP1pZ96w1Ravj_kV', 'png'], ['1BM7G0eZ6-ZxW6I1DiWCjpI8v0O647L6e', 'png'],
  ['1iIqleaI-ERhVUjF6gDymm_qjfE96Jrbw', 'png'], ['1c5pffuQQcnuafwzaLy6sHxiYCSB5GWqI', 'png'],
  ['1t_zqsnOuuM9PUtlBAiGnLdetsI6WqLAG', 'png'], ['1vBjDBB7z3ot6dXbAfTDQTVbSwoyqbVf9', 'png'],
  ['1KSivfNjXjkxa0aJ1WjShdonlvtjIavvU', 'png'], ['1vKcKs0xYra8b4PugsIiK-ETxC9nRRyba', 'png'],
  ['1t0Y-ltgAIF_Z02wzNmqKlzmwXStPvTA8', 'png'], ['1sFKp2bOujt-BjYBgcbf5ByElTlxXevnd', 'png'],
  // Car Launch renders (png)
  ['1PiiBV7xOjWEKWVyy3o9q6_apoPCPfIPc', 'png'], ['1C8tkmOMw2jurmPU5cFnHZsaMSp3rNh0f', 'png'],
  ['1BVRnoNNpivuvsY9n_q-zdE_c6dfDDth4', 'png'], ['1QoAQitTJ1fF8YHNsT2ArvFNgt9b52WQo', 'png'],
  ['1fBOtvhDZ-OqRkoqxNpHchJIzcQXtInkJ', 'png'], ['1rW_T9W0g95gTOHY2dybtPRAHwBXBXVJc', 'png'],
  ['1ChyWjz5BuIATTq2uGuEiqBwYuAG10OHo', 'png'], ['14ho1Pc1H0NpgSECLWefdSi1XSerRx6p8', 'png'],
  ['1JgjlpCcCMFfqj-T0i5bO7eOgzpWVMjhC', 'png'],
  // 3D objects
  ['1aqOEnFW07PazPkdkgI3m8X1-5QImml7U', 'png'],  // AI Assistant Ball
  ['15Z2lyyQFEJlZo4_LWkLrLVB-Ph_vLev1', 'jpg'], ['1MxOEGuljPCMlzSyRebaQP5SzqAzLQK_A', 'jpg'], // Bat
  ['1_aVMtiEv3RDlJxufXywo5Fk_-iwf4rFz', 'png'],  // Coffee Shop
  ['1sVWxkfNxvooo32MFX0J7AavU8kMSh3D8', 'png'],  // Lighting
  // Poster / graphic design
  ['1I1nMpeJ25-URbRsJyd3vLSfKmhuHmbvc', 'jpg'],
];

// Video poster frames (thumbnail), keyed by the video's Drive id.
const POSTERS = [
  // Video editing (12)
  '14L60Q8kpwPUSFvtB99erePOaU6wZZTKZ', '19Z0oD2b1b4BkNHsSxZfUZNQH9mgz_8U8',
  '1yu_mSH5F66n7egLBjsH_Q7ugUOeRctXA', '1iC-kPKUIR2Rx-8DpCml7kEbf8vAA9c5r',
  '1jPQB5MXwN1f4UhgZDOzRnz-jyiFTFrWf', '1DRe0cjcmr3QkVf1LjhTLspYiaCBGj_lA',
  '1fjWfpSM2md56VGV0FJanT4tyF4wwsMB0', '13Yo20MXOniju78MUnpTY6RIR3YRGV-Qw',
  '1Sd28aWc6Ixc8GBL-imPOypUIcSvn1U-t', '1oSL-UVPoTWHO6v0I1Q-cWkUtbP6LcCka',
  '1o9Nqar_qfo8TUtWHM9xZffioTSpnNIku', '1sqz9WtiQVRyCMD4ca6Jccvv0n01wlkd2',
  // SpeakX (9)
  '1IJuXaeqQlmJscyQLUmXEjHL_ZwQUkV2u', '1mRk_HvHpbafQYfGMVM2kvh0__ZykPQ91',
  '1Si6PbbJcHPihLv43q8J5qMkzHQ7G-tPi', '1RxLmM3XNaVrwAQJ5liRtJlyqAOBUmZ0s',
  '1Wjtzr8P69V0KUA_AdEp2haFCtw5hsoRY', '1AxRjbxXt6gApB17Z7oIRPGbYNENu7xBD',
  '19GBXGB_B2NAsqbxivoMcCXTrJqA6_T4r', '1vyc981Gb7JD4SqFIG6tSXuxfnnfJP4ym',
  '1IJJIMfrOXUKhMh17dpKDZIFSsUlAU3Rt',
  // Animated character dance
  '1V3b-OFior05JKwU13iGcWvxoCNbqXoae',
];

async function exists(p) { try { await stat(p); return true; } catch { return false; } }

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  const type = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  return { ok: res.ok, type, buf };
}

// Full images: try the original via uc download, fall back to a large thumbnail.
async function fetchImage(id, ext) {
  let r = await get(`https://drive.google.com/uc?export=download&id=${id}`);
  if (!r.ok || !r.type.startsWith('image/') || r.buf.length < 1024) {
    r = await get(`https://drive.google.com/thumbnail?id=${id}&sz=w2000`);
  }
  if (!r.type.startsWith('image/') || r.buf.length < 512) {
    throw new Error(`no image bytes (type=${r.type}, len=${r.buf.length})`);
  }
  return r.buf;
}

async function fetchPoster(id) {
  const r = await get(`https://drive.google.com/thumbnail?id=${id}&sz=w1280`);
  if (!r.type.startsWith('image/') || r.buf.length < 512) {
    throw new Error(`no poster bytes (type=${r.type}, len=${r.buf.length})`);
  }
  return r.buf;
}

async function run() {
  await mkdir(IMG_DIR, { recursive: true });
  await mkdir(POSTER_DIR, { recursive: true });

  let done = 0, skipped = 0, failed = 0;
  const fail = [];

  for (const [id, ext] of IMAGES) {
    const out = join(IMG_DIR, `${id}.${ext}`);
    if (await exists(out)) { skipped++; continue; }
    try { await writeFile(out, await fetchImage(id, ext)); done++; process.stdout.write(`img  ok  ${id}.${ext}\n`); }
    catch (e) { failed++; fail.push(`img ${id}: ${e.message}`); process.stdout.write(`img  FAIL ${id} — ${e.message}\n`); }
  }

  for (const id of POSTERS) {
    const out = join(POSTER_DIR, `${id}.jpg`);
    if (await exists(out)) { skipped++; continue; }
    try { await writeFile(out, await fetchPoster(id)); done++; process.stdout.write(`pstr ok  ${id}.jpg\n`); }
    catch (e) { failed++; fail.push(`poster ${id}: ${e.message}`); process.stdout.write(`pstr FAIL ${id} — ${e.message}\n`); }
  }

  console.log(`\nDone. downloaded=${done} skipped=${skipped} failed=${failed}`);
  if (fail.length) console.log('Failures:\n' + fail.map((f) => '  - ' + f).join('\n'));
}

run().catch((e) => { console.error(e); process.exit(1); });
