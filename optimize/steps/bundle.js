export default async function bundle() {
  // eslint-disable-next-line no-undef
  return Bun.build({
    entrypoints: [`${globalThis.dirs.src}/index.js`],
    outdir: globalThis.dirs.dest,
    minify: true,
    naming: "[dir]/[name]-[hash].[ext]",
  });
}
