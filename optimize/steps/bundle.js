export default async function bundle() {
  // eslint-disable-next-line no-undef
  const build = await Bun.build({
    entrypoints: [`${globalThis.dirs.src}/index.js`],
    outdir: globalThis.dirs.dest,
    minify: true,
    naming: "[dir]/[name]-[hash].[ext]",
  });

  return build.outputs[0].path.substring(
    build.outputs[0].path.lastIndexOf("/")
  );
}
