// eslint-disable-next-line import/no-extraneous-dependencies
import { minify } from "html-minifier";

export default async function htmlMinifier(file) {
  // eslint-disable-next-line no-undef
  const html = await Bun.file(`./src/${file}`).text();
  return minify(html, {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  });
}
