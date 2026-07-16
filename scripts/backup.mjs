// Full off-Cloudflare backup of the remote (production) D1 database, plus a
// source code snapshot.
//
//   npm run backup
//
// Exports the ENTIRE remote D1 (schema + all rows, incl. media image BLOBs, users,
// orders) to a timestamped .sql file under backups/, and archives the current git
// HEAD to a matching .zip. These dumps contain OAuth tokens and password hashes,
// so backups/ is gitignored — never commit or share them. Restore the database
// with:  wrangler d1 execute bosbapremiumfoods --remote --file backups/<that-file>.sql
//
// Old dumps/snapshots are pruned automatically, keeping the most recent KEEP of each.

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DB = "bosbapremiumfoods";
const KEEP = 8; // how many dumps to retain (weekly cadence -> ~2 months of history)

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "backups");
fs.mkdirSync(dir, { recursive: true });

const existing = (pattern) =>
  fs
    .readdirSync(dir)
    .filter((f) => pattern.test(f))
    .map((f) => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);

const DB_PATTERN = /^d1-backup-.*\.sql$/;
const SRC_PATTERN = /^source-.*\.zip$/;

// --auto (the scheduled run) only backs up weekly: skip if the newest dump is < 6.5
// days old. The task fires daily, so a missed week self-heals the next day rather than
// waiting another full week. A manual `npm run backup` ignores this and always runs.
if (process.argv.includes("--auto")) {
  const newest = existing(DB_PATTERN)[0];
  if (newest && Date.now() - newest.t < 6.5 * 24 * 60 * 60 * 1000) {
    const days = ((Date.now() - newest.t) / 86_400_000).toFixed(1);
    console.log(`\nSkipping: newest backup is ${days} day(s) old (weekly cadence). \`npm run backup\` forces one.\n`);
    process.exit(0);
  }
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const dbOut = path.join(dir, `d1-backup-${stamp}.sql`);
const srcOut = path.join(dir, `source-${stamp}.zip`);

console.log(`\nExporting remote D1 "${DB}" -> ${path.relative(root, dbOut)}\n`);
execSync(`npx wrangler d1 export ${DB} --remote --output "${dbOut}"`, { stdio: "inherit", cwd: root });
const dbBytes = fs.statSync(dbOut).size;
console.log(`\n✓ Database backup written (${(dbBytes / 1024 / 1024).toFixed(2)} MB)`);

console.log(`\nArchiving source tree (git HEAD) -> ${path.relative(root, srcOut)}\n`);
execSync(`git archive --format=zip -o "${srcOut}" HEAD`, { stdio: "inherit", cwd: root });
const srcBytes = fs.statSync(srcOut).size;
console.log(`✓ Source snapshot written (${(srcBytes / 1024 / 1024).toFixed(2)} MB)`);

// prune: keep the newest KEEP of each kind
for (const pattern of [DB_PATTERN, SRC_PATTERN]) {
  const files = existing(pattern);
  for (const { f } of files.slice(KEEP)) {
    fs.unlinkSync(path.join(dir, f));
    console.log(`  pruned old backup: ${f}`);
  }
}
console.log(`  up to ${KEEP} of each (database, source) retained in backups/\n`);
