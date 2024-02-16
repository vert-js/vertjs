import type { BuildOutput } from "bun";

/* eslint-disable no-undef */
export default async function copyIndexHtml(
  JSbundles: BuildOutput,
  CSSbundles: string[],
  srcPath: string,
  distPath: string
) {
  const srcHTML = Bun.file(`${srcPath}/index.html`);
  let htmlContent = await srcHTML.text();
  const indexjs = JSbundles.outputs.shift();
  if (indexjs)
    htmlContent = htmlContent.replace(
      "main.js",
      `/public${indexjs.path.substring(indexjs.path.lastIndexOf("/"))}`
    );
  const indexcss = CSSbundles.shift();
  if (indexcss)
    htmlContent = htmlContent.replace(
      "main.css",
      `/public${indexcss.substring(indexcss.lastIndexOf("/"))}`
    );
  const destHTML = Bun.file(`${distPath}/index.html`);
  await Bun.write(destHTML, htmlContent);
}
