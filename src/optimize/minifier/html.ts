// eslint-disable-next-line import/no-extraneous-dependencies
import { minify } from "html-minifier";

export default function htmlMinifier(content: string) {
  return minify(content, {
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
