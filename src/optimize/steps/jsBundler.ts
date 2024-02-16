import type { BuildOutput } from "bun";

export default async function jsBundler(
  srcPath: string,
  distPath: string
): Promise<BuildOutput> {
  // eslint-disable-next-line no-undef
  return Bun.build({
    entrypoints: [`${srcPath}/main.js`],
    outdir: `${distPath}/public`,
    minify: true,
    naming: "[dir]/[name]-[hash].[ext]",
  });
}
