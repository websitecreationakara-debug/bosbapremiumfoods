// One-off backfill: generate the letterboxed 1200x630 social_image_url for
// every existing product that has a cover image_url but no social_image_url
// yet (i.e. everything saved before this feature existed). Mirrors the
// client-side letterboxImage() logic in src/lib/image.ts exactly (blurred
// cover backdrop + full contain-fit photo on top), just done in Node/sharp
// instead of browser canvas since this runs once over the whole catalog
// rather than per-save in the admin.
//
// D1 rejects any single SQL statement with a literal (string/blob) over
// somewhere between 30KB and 50KB ("statement too long: SQLITE_TOOBIG") --
// confirmed empirically, not documented. A whole JPEG blob can't go in one
// INSERT, so each image is built with an empty placeholder INSERT followed
// by a series of `UPDATE media SET data = data || X'<chunk>'` statements,
// each chunk safely under that limit (20KB raw / 40KB hex text).
//
// Usage: node scripts/backfill-social-images.cjs <input.json> <output.sql> [limit]
//   input.json  = `wrangler d1 execute ... --json` output for
//                 "SELECT id, title, image_url FROM products WHERE image_url
//                 IS NOT NULL AND social_image_url IS NULL"
//   output.sql  = where to write the INSERT/UPDATE statements
//   limit       = optional, process only the first N rows (for a dry run)

const sharp = require("sharp");
const crypto = require("crypto");
const fs = require("fs");

const SITE = "https://bosbapremiumfoods.com";
const W = 1200;
const H = 630;
const CHUNK_BYTES = 20000;

function sqlString(s) {
  return `'${s.replace(/'/g, "''")}'`;
}

async function main() {
  const [, , inputPath, outputPath, limitArg] = process.argv;
  if (!inputPath || !outputPath) {
    console.error("Usage: node backfill-social-images.cjs <input.json> <output.sql> [limit]");
    process.exit(1);
  }
  const limit = limitArg ? Number(limitArg) : Infinity;

  const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const rows = data[0].results.slice(0, limit);

  const statements = [];
  let ok = 0;
  let failed = 0;

  for (const row of rows) {
    const url = row.image_url.startsWith("http") ? row.image_url : `${SITE}${row.image_url}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`fetch ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());

      const bg = await sharp(buf)
        .resize(W, H, { fit: "cover" })
        .blur(24)
        .modulate({ brightness: 0.85 })
        .toBuffer();
      const fg = await sharp(buf)
        .resize(W, H, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();
      const composed = await sharp(bg)
        .composite([{ input: fg, gravity: "center" }])
        .jpeg({ quality: 85 })
        .toBuffer();

      const key = `social-${row.id.slice(0, 8)}-${crypto.randomBytes(4).toString("hex")}.jpg`;
      const mediaUrl = `/media/${key}`;
      const mediaId = crypto.randomUUID();
      const now = new Date().toISOString();

      statements.push(
        `INSERT INTO media (id, key, url, filename, content_type, size, data, created_at) VALUES (${sqlString(mediaId)}, ${sqlString(key)}, ${sqlString(mediaUrl)}, 'social.jpg', 'image/jpeg', ${composed.length}, X'', ${sqlString(now)});`,
      );
      for (let i = 0; i < composed.length; i += CHUNK_BYTES) {
        const chunk = composed.subarray(i, i + CHUNK_BYTES).toString("hex");
        // CAST(... AS BLOB) matters: without it, D1's || silently returns a
        // TEXT-typed result (confirmed empirically — length() then reports a
        // UTF-8 character count instead of the real byte count), and the app's
        // media route serves that back UTF-8-decoded/re-encoded, corrupting
        // every non-UTF-8 byte in the image.
        statements.push(
          `UPDATE media SET data = CAST(data || X'${chunk}' AS BLOB) WHERE id = ${sqlString(mediaId)};`,
        );
      }
      statements.push(`UPDATE products SET social_image_url = ${sqlString(mediaUrl)} WHERE id = ${sqlString(row.id)};`);

      ok++;
      console.log(`ok   ${row.title} -> ${mediaUrl} (${composed.length} bytes, ${Math.ceil(composed.length / CHUNK_BYTES)} chunks)`);
    } catch (err) {
      failed++;
      console.error(`FAIL ${row.title} (${row.id}): ${err.message}`);
    }
  }

  fs.writeFileSync(outputPath, statements.join("\n") + "\n");
  console.log(`\n${ok} ok, ${failed} failed. Wrote ${statements.length} statements to ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
