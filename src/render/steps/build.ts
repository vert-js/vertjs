import { Glob } from "bun";
import html from "bun-plugin-html";
import lightningcss from "bun-lightningcss";

export default async function build(
  srcPath: string,
  distPath: string
): Promise<BuildOutput> {
  const glob = new Glob("**/*.html");
  const htmlFiles = [
    ...glob.scanSync({
      cwd: srcPath,
      absolute: true,
    }),
  ];
  // eslint-disable-next-line no-undef
  return Bun.build({
    entrypoints: htmlFiles,
    outdir: `${distPath}`,
    minify: true,
    naming: "[dir]/[name]-[hash].[ext]",
    plugins: [html(), lightningcss()],
  });
}
