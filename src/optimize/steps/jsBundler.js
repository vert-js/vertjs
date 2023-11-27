export default async function jsBundler() {
  // eslint-disable-next-line no-undef
  return Bun.build({
    entrypoints: [`${globalThis.dirs.src}/main.js`],
    outdir: `${globalThis.dirs.dest}/public`,
    minify: true,
    naming: "[dir]/[name]-[hash].[ext]",
  });
}
